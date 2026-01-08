'use client'

import { useMemo, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { fetchTerrain, ElevationData, TerrainConfig, ElevationAPIProvider } from '@/lib/terrain-api'

interface RealWorldTerrainProps {
  lat: number
  lng: number
  areaKm?: number
  resolution?: number
  scale?: number
  verticalExaggeration?: number
  apiProvider?: ElevationAPIProvider
  useCache?: boolean
  onProgress?: (progress: number, message: string) => void
  onLoad?: (data: ElevationData) => void
  onError?: (error: Error) => void
}

export function RealWorldTerrain({
  lat,
  lng,
  areaKm = 10,
  resolution = 64,
  scale = 100,
  verticalExaggeration = 1.5,
  apiProvider = 'auto',
  useCache = true,
  onProgress,
  onLoad,
  onError
}: RealWorldTerrainProps) {
  const [elevationData, setElevationData] = useState<ElevationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [error, setError] = useState<string | null>(null)

  // Progress callback
  const handleProgress = useCallback((progress: number, message: string) => {
    setLoadingProgress(progress)
    setLoadingMessage(message)
    onProgress?.(progress, message)
  }, [onProgress])

  // Fetch elevation data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      setLoadingProgress(0)
      setLoadingMessage('Fetching terrain data...')

      const config: TerrainConfig = {
        center: { lat, lng },
        zoom: 12,
        tileSize: 512,
        areaKm,
        resolution
      }

      try {
        const data = await fetchTerrain(config, {
          provider: apiProvider,
          useCache,
          onProgress: handleProgress
        })

        setElevationData(data)
        onLoad?.(data)
        console.log(`[Terrain] Loaded from ${data.source}: ${data.minElevation.toFixed(0)}m - ${data.maxElevation.toFixed(0)}m`)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch terrain'
        setError(errorMessage)
        onError?.(err instanceof Error ? err : new Error(errorMessage))
        console.error('[Terrain] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [lat, lng, areaKm, resolution, apiProvider, useCache, handleProgress, onLoad, onError])

  // Generate geometry from elevation data
  const geometry = useMemo(() => {
    if (!elevationData) return null

    const { elevations, width, height, minElevation, maxElevation } = elevationData
    const elevationRange = maxElevation - minElevation

    const geo = new THREE.PlaneGeometry(scale, scale, width - 1, height - 1)
    const positions = geo.attributes.position.array as Float32Array
    const colors = new Float32Array(positions.length)

    // Apply elevation to vertices
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const vertexIndex = y * width + x
        const posIndex = vertexIndex * 3

        // Get elevation and normalize
        const elevation = elevations[vertexIndex]
        const normalizedElev = (elevation - minElevation) / (elevationRange || 1)

        // Scale height (plane is in XY, we modify Z which becomes Y after rotation)
        const heightScale = (scale / areaKm) * 0.001 * verticalExaggeration
        positions[posIndex + 2] = (elevation - minElevation) * heightScale

        // Color based on elevation (natural gradient)
        const colorIndex = posIndex
        if (normalizedElev < 0.15) {
          // Low - dark green (valleys)
          colors[colorIndex] = 0.20
          colors[colorIndex + 1] = 0.32
          colors[colorIndex + 2] = 0.15
        } else if (normalizedElev < 0.30) {
          // Medium-low - forest green
          colors[colorIndex] = 0.25
          colors[colorIndex + 1] = 0.40
          colors[colorIndex + 2] = 0.20
        } else if (normalizedElev < 0.50) {
          // Medium - sage green
          colors[colorIndex] = 0.35
          colors[colorIndex + 1] = 0.50
          colors[colorIndex + 2] = 0.28
        } else if (normalizedElev < 0.70) {
          // Medium-high - olive/brown
          colors[colorIndex] = 0.48
          colors[colorIndex + 1] = 0.45
          colors[colorIndex + 2] = 0.35
        } else if (normalizedElev < 0.85) {
          // High - pale sage/rock
          colors[colorIndex] = 0.58
          colors[colorIndex + 1] = 0.55
          colors[colorIndex + 2] = 0.48
        } else {
          // Peaks - light gray/snow
          colors[colorIndex] = 0.72
          colors[colorIndex + 1] = 0.70
          colors[colorIndex + 2] = 0.68
        }
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    return geo
  }, [elevationData, scale, areaKm, verticalExaggeration])

  // Loading state
  if (loading) {
    return (
      <group>
        {/* Placeholder terrain */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[scale, scale, 4, 4]} />
          <meshStandardMaterial color="#456a4b" opacity={0.3} transparent />
        </mesh>
        {/* Loading indicator - pulsing ring */}
        <mesh position={[0, 5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8, 10, 32]} />
          <meshBasicMaterial color="#ffffff" opacity={0.5 + Math.sin(Date.now() / 500) * 0.3} transparent />
        </mesh>
      </group>
    )
  }

  // Error state
  if (error || !geometry) {
    console.error('[Terrain] Display error:', error)
    return (
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[scale, scale]} />
        <meshStandardMaterial color="#8b4444" />
      </mesh>
    )
  }

  // Rendered terrain
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        vertexColors
        roughness={0.85}
        metalness={0.05}
        flatShading={false}
      />
    </mesh>
  )
}

// Info overlay component for debugging
export function TerrainInfo({ data }: { data: ElevationData | null }) {
  if (!data) return null

  return (
    <div className="absolute top-20 left-4 bg-black/60 text-white p-3 rounded-lg text-xs font-mono">
      <div className="font-medium mb-1 text-green-400">Terrain Data</div>
      <div>Source: {data.source}</div>
      <div>Min: {data.minElevation.toFixed(0)}m</div>
      <div>Max: {data.maxElevation.toFixed(0)}m</div>
      <div>Range: {(data.maxElevation - data.minElevation).toFixed(0)}m</div>
      <div>Grid: {data.width}x{data.height}</div>
    </div>
  )
}

// Loading overlay component
export function TerrainLoadingOverlay({
  progress,
  message
}: {
  progress: number
  message: string
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
      <div className="bg-black/80 text-white p-6 rounded-xl text-center max-w-sm">
        <div className="mb-3 text-lg font-medium">Loading Terrain</div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="text-sm text-white/70">{message}</div>
        <div className="mt-2 text-xs text-white/50">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  )
}
