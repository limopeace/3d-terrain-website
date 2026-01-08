/**
 * Free Terrain Elevation API Client
 * No credit card required - uses Open Topo Data, Open-Meteo, and Open-Elevation
 *
 * API Priority:
 * 1. Open Topo Data (30m resolution, 1000 calls/day)
 * 2. Open-Meteo (90m resolution, unlimited)
 * 3. Open-Elevation (30-90m, slower fallback)
 */

export interface TerrainConfig {
  center: { lat: number; lng: number }
  zoom: number           // 10-14 recommended for terrain
  tileSize: number       // Usually 512
  areaKm: number         // Area size in km
  resolution: number     // Grid points (e.g., 128x128)
}

export interface ElevationData {
  elevations: Float32Array
  width: number
  height: number
  minElevation: number
  maxElevation: number
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
  source: 'opentopodata' | 'openmeteo' | 'openelevation' | 'cache'
}

export type ElevationAPIProvider = 'opentopodata' | 'openmeteo' | 'openelevation' | 'auto'

interface CacheEntry {
  data: {
    elevations: number[]
    width: number
    height: number
    minElevation: number
    maxElevation: number
    bounds: ElevationData['bounds']
    source: ElevationData['source']
  }
  timestamp: number
}

// Cache key generator
function getCacheKey(config: TerrainConfig): string {
  return `terrain-${config.center.lat.toFixed(4)}-${config.center.lng.toFixed(4)}-${config.areaKm}-${config.resolution}`
}

// Check localStorage cache (24 hour TTL)
function getFromCache(config: TerrainConfig): ElevationData | null {
  if (typeof window === 'undefined') return null

  try {
    const key = getCacheKey(config)
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const entry: CacheEntry = JSON.parse(cached)
    const ttl = 24 * 60 * 60 * 1000 // 24 hours

    if (Date.now() - entry.timestamp > ttl) {
      localStorage.removeItem(key)
      return null
    }

    console.log(`[Terrain] Using cached data from ${entry.data.source}`)
    return {
      ...entry.data,
      elevations: new Float32Array(entry.data.elevations),
      source: 'cache'
    }
  } catch {
    return null
  }
}

// Save to localStorage cache
function saveToCache(config: TerrainConfig, data: ElevationData): void {
  if (typeof window === 'undefined') return

  try {
    const key = getCacheKey(config)
    const entry: CacheEntry = {
      data: {
        elevations: Array.from(data.elevations),
        width: data.width,
        height: data.height,
        minElevation: data.minElevation,
        maxElevation: data.maxElevation,
        bounds: data.bounds,
        source: data.source
      },
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(entry))
    console.log(`[Terrain] Cached data from ${data.source}`)
  } catch (e) {
    console.warn('[Terrain] Failed to cache:', e)
  }
}

// Calculate bounding box from center and area size
function getBoundingBox(lat: number, lng: number, areaKm: number) {
  const kmPerDegreeLat = 111.32
  const kmPerDegreeLng = 111.32 * Math.cos(lat * Math.PI / 180)

  const deltaLat = areaKm / 2 / kmPerDegreeLat
  const deltaLng = areaKm / 2 / kmPerDegreeLng

  return {
    north: lat + deltaLat,
    south: lat - deltaLat,
    east: lng + deltaLng,
    west: lng - deltaLng
  }
}

// Progress callback type
export type ProgressCallback = (progress: number, message: string) => void

/**
 * Open Topo Data API (Primary)
 * - 30m resolution (SRTM30m)
 * - 100 locations per request
 * - 1000 calls per day
 * - 1 call per second
 */
export async function fetchOpenTopoData(
  config: TerrainConfig,
  onProgress?: ProgressCallback
): Promise<ElevationData> {
  const { center, resolution } = config
  const bounds = getBoundingBox(center.lat, center.lng, config.areaKm)

  console.log('[Terrain] Fetching from Open Topo Data (30m resolution)...')
  onProgress?.(0.1, 'Fetching terrain from Open Topo Data...')

  // Build locations string (max 100 per request)
  const allLocations: string[] = []
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const lat = bounds.north - (y / (resolution - 1)) * (bounds.north - bounds.south)
      const lng = bounds.west + (x / (resolution - 1)) * (bounds.east - bounds.west)
      allLocations.push(`${lat.toFixed(6)},${lng.toFixed(6)}`)
    }
  }

  // Split into chunks of 100 (API limit)
  const chunkSize = 100
  const chunks: string[][] = []
  for (let i = 0; i < allLocations.length; i += chunkSize) {
    chunks.push(allLocations.slice(i, i + chunkSize))
  }

  const elevations = new Float32Array(resolution * resolution)
  let minElev = Infinity
  let maxElev = -Infinity
  let offset = 0

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const locationsParam = chunk.join('|')
    const url = `https://api.opentopodata.org/v1/srtm30m?locations=${encodeURIComponent(locationsParam)}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Open Topo Data API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.status !== 'OK' || !data.results) {
        throw new Error('Invalid response from Open Topo Data')
      }

      for (const result of data.results) {
        const elev = result.elevation ?? 0
        elevations[offset++] = elev
        if (elev !== null) {
          minElev = Math.min(minElev, elev)
          maxElev = Math.max(maxElev, elev)
        }
      }

      const progress = 0.1 + (i / chunks.length) * 0.9
      onProgress?.(progress, `Loading terrain: ${Math.round(progress * 100)}%`)

      // Rate limiting: 1 request per second
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 1100))
      }
    } catch (error) {
      console.error(`[Terrain] Open Topo Data chunk ${i + 1}/${chunks.length} failed:`, error)
      throw error
    }
  }

  // Handle edge case where no valid elevations found
  if (minElev === Infinity) minElev = 0
  if (maxElev === -Infinity) maxElev = 100

  onProgress?.(1, 'Terrain loaded successfully')

  return {
    elevations,
    width: resolution,
    height: resolution,
    minElevation: minElev,
    maxElevation: maxElev,
    bounds,
    source: 'opentopodata'
  }
}

/**
 * Open-Meteo Elevation API (Fallback 1)
 * - 90m resolution (Copernicus DEM)
 * - Effectively unlimited calls
 * - Very reliable
 */
export async function fetchOpenMeteo(
  config: TerrainConfig,
  onProgress?: ProgressCallback
): Promise<ElevationData> {
  const { center, resolution } = config
  const bounds = getBoundingBox(center.lat, center.lng, config.areaKm)

  console.log('[Terrain] Fetching from Open-Meteo (90m resolution)...')
  onProgress?.(0.1, 'Fetching terrain from Open-Meteo...')

  // Build latitude and longitude arrays
  const latitudes: number[] = []
  const longitudes: number[] = []

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const lat = bounds.north - (y / (resolution - 1)) * (bounds.north - bounds.south)
      const lng = bounds.west + (x / (resolution - 1)) * (bounds.east - bounds.west)
      latitudes.push(Number(lat.toFixed(6)))
      longitudes.push(Number(lng.toFixed(6)))
    }
  }

  // Open-Meteo accepts comma-separated coordinates
  // Split into chunks to avoid URL length limits
  const chunkSize = 500
  const elevations = new Float32Array(resolution * resolution)
  let minElev = Infinity
  let maxElev = -Infinity
  let offset = 0

  const totalChunks = Math.ceil(latitudes.length / chunkSize)

  for (let i = 0; i < latitudes.length; i += chunkSize) {
    const chunkLats = latitudes.slice(i, i + chunkSize)
    const chunkLngs = longitudes.slice(i, i + chunkSize)

    const url = `https://api.open-meteo.com/v1/elevation?latitude=${chunkLats.join(',')}&longitude=${chunkLngs.join(',')}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.elevation || !Array.isArray(data.elevation)) {
        throw new Error('Invalid response from Open-Meteo')
      }

      for (const elev of data.elevation) {
        const elevation = elev ?? 0
        elevations[offset++] = elevation
        if (elevation !== null) {
          minElev = Math.min(minElev, elevation)
          maxElev = Math.max(maxElev, elevation)
        }
      }

      const chunkIndex = Math.floor(i / chunkSize)
      const progress = 0.1 + (chunkIndex / totalChunks) * 0.9
      onProgress?.(progress, `Loading terrain: ${Math.round(progress * 100)}%`)

      // Small delay to be nice to the API
      if (i + chunkSize < latitudes.length) {
        await new Promise(r => setTimeout(r, 100))
      }
    } catch (error) {
      console.error(`[Terrain] Open-Meteo chunk failed:`, error)
      throw error
    }
  }

  // Handle edge case where no valid elevations found
  if (minElev === Infinity) minElev = 0
  if (maxElev === -Infinity) maxElev = 100

  onProgress?.(1, 'Terrain loaded successfully')

  return {
    elevations,
    width: resolution,
    height: resolution,
    minElevation: minElev,
    maxElevation: maxElev,
    bounds,
    source: 'openmeteo'
  }
}

/**
 * Open-Elevation API (Fallback 2)
 * - 30-90m resolution
 * - ~1000 requests per month
 * - Slower but reliable
 */
export async function fetchOpenElevation(
  config: TerrainConfig,
  onProgress?: ProgressCallback
): Promise<ElevationData> {
  const { center, resolution } = config
  const bounds = getBoundingBox(center.lat, center.lng, config.areaKm)

  console.log('[Terrain] Fetching from Open-Elevation (fallback)...')
  onProgress?.(0.1, 'Fetching terrain from Open-Elevation...')

  // Build locations array
  const locations: { latitude: number; longitude: number }[] = []

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const lat = bounds.north - (y / (resolution - 1)) * (bounds.north - bounds.south)
      const lng = bounds.west + (x / (resolution - 1)) * (bounds.east - bounds.west)
      locations.push({ latitude: lat, longitude: lng })
    }
  }

  // Split into chunks (API has limits)
  const chunkSize = 100
  const chunks: typeof locations[] = []
  for (let i = 0; i < locations.length; i += chunkSize) {
    chunks.push(locations.slice(i, i + chunkSize))
  }

  const elevations = new Float32Array(resolution * resolution)
  let minElev = Infinity
  let maxElev = -Infinity
  let offset = 0

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]

    try {
      const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: chunk })
      })

      if (!response.ok) throw new Error('Open-Elevation API error')

      const data = await response.json()

      for (const result of data.results) {
        const elev = result.elevation || 0
        elevations[offset++] = elev
        minElev = Math.min(minElev, elev)
        maxElev = Math.max(maxElev, elev)
      }

      const progress = 0.1 + (i / chunks.length) * 0.9
      onProgress?.(progress, `Loading terrain: ${Math.round(progress * 100)}%`)

      // Rate limiting
      await new Promise(r => setTimeout(r, 150))
    } catch (error) {
      console.warn('[Terrain] Open-Elevation chunk failed:', error)
      // Fill with zeros for failed chunk
      for (let j = 0; j < chunk.length; j++) {
        elevations[offset++] = 0
      }
    }
  }

  // Handle edge case
  if (minElev === Infinity) minElev = 0
  if (maxElev === -Infinity) maxElev = 100

  onProgress?.(1, 'Terrain loaded successfully')

  return {
    elevations,
    width: resolution,
    height: resolution,
    minElevation: minElev,
    maxElevation: maxElev,
    bounds,
    source: 'openelevation'
  }
}

/**
 * Main fetch function with automatic fallback
 * Tries APIs in order: Open Topo Data → Open-Meteo → Open-Elevation
 * Also checks cache first
 */
export async function fetchTerrain(
  config: TerrainConfig,
  options?: {
    provider?: ElevationAPIProvider
    useCache?: boolean
    onProgress?: ProgressCallback
  }
): Promise<ElevationData> {
  const { provider = 'auto', useCache = true, onProgress } = options || {}

  // Check cache first
  if (useCache) {
    const cached = getFromCache(config)
    if (cached) {
      onProgress?.(1, 'Loaded from cache')
      return cached
    }
  }

  let data: ElevationData | null = null
  let lastError: Error | null = null

  // If specific provider requested
  if (provider !== 'auto') {
    switch (provider) {
      case 'opentopodata':
        data = await fetchOpenTopoData(config, onProgress)
        break
      case 'openmeteo':
        data = await fetchOpenMeteo(config, onProgress)
        break
      case 'openelevation':
        data = await fetchOpenElevation(config, onProgress)
        break
    }
  } else {
    // Auto mode: try each provider in order
    const providers = [
      { name: 'Open Topo Data', fn: fetchOpenTopoData },
      { name: 'Open-Meteo', fn: fetchOpenMeteo },
      { name: 'Open-Elevation', fn: fetchOpenElevation }
    ]

    for (const { name, fn } of providers) {
      try {
        console.log(`[Terrain] Trying ${name}...`)
        data = await fn(config, onProgress)
        console.log(`[Terrain] Success with ${name}`)
        break
      } catch (error) {
        console.warn(`[Terrain] ${name} failed:`, error)
        lastError = error instanceof Error ? error : new Error(String(error))
        // Continue to next provider
      }
    }
  }

  if (!data) {
    throw lastError || new Error('All terrain providers failed')
  }

  // Save to cache
  if (useCache) {
    saveToCache(config, data)
  }

  return data
}

/**
 * Clear terrain cache (useful for debugging)
 */
export function clearTerrainCache(): void {
  if (typeof window === 'undefined') return

  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('terrain-')) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key))
  console.log(`[Terrain] Cleared ${keysToRemove.length} cached entries`)
}
