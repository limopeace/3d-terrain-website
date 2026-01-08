import { ElevationAPIProvider } from '@/lib/terrain-api'

export interface TerrainSettings {
  type: 'procedural' | 'realworld'
  // Real-world terrain settings
  realworld?: {
    lat: number
    lng: number
    areaKm: number
    resolution: number
    verticalExaggeration: number
  }
  // API provider preference (auto tries all in order)
  apiProvider: ElevationAPIProvider
  // Enable caching to localStorage (recommended)
  useCache: boolean
}

// Default terrain configuration
export const terrainSettings: TerrainSettings = {
  // Switch between 'procedural' and 'realworld'
  // Use 'procedural' for demo/development, 'realworld' for production with API access
  type: 'procedural',

  // Real-world terrain config (used when type is 'realworld')
  realworld: {
    // Chandigarh/Shivalik foothills region
    lat: 30.74997250386267,
    lng: 76.79576794084382,
    areaKm: 15,           // 15km x 15km area
    resolution: 64,       // 64x64 for faster loading (use 128 for detail)
    verticalExaggeration: 2.0  // Exaggerate height for visual impact
  },

  // API provider: 'auto' | 'opentopodata' | 'openmeteo' | 'openelevation'
  // 'openmeteo' is most reliable for browser CORS, 'auto' tries each in order
  apiProvider: 'openmeteo',

  // Cache terrain data in localStorage (24h TTL)
  // Recommended to avoid rate limits
  useCache: true
}

// Preset locations for quick switching
export const presetLocations = {
  chandigarh: {
    name: 'Chandigarh Foothills',
    description: 'Shivalik Hills near Chandigarh, India',
    lat: 30.74997250386267,
    lng: 76.79576794084382,
    areaKm: 15
  },
  shimla: {
    name: 'Shimla',
    description: 'Hill station in Himachal Pradesh, India',
    lat: 31.1048,
    lng: 77.1734,
    areaKm: 12
  },
  manali: {
    name: 'Manali Valley',
    description: 'Himalayan resort town in Himachal Pradesh',
    lat: 32.2396,
    lng: 77.1887,
    areaKm: 20
  },
  blueRidge: {
    name: 'Blue Ridge Mountains',
    description: 'Appalachian mountain range, Virginia, USA',
    lat: 37.0,
    lng: -80.4,
    areaKm: 20
  },
  grandCanyon: {
    name: 'Grand Canyon',
    description: 'Iconic canyon in Arizona, USA',
    lat: 36.1069,
    lng: -112.1129,
    areaKm: 25
  },
  swissAlps: {
    name: 'Swiss Alps (Zermatt)',
    description: 'Alpine region near the Matterhorn',
    lat: 45.9763,
    lng: 7.6586,
    areaKm: 15
  },
  mountEverest: {
    name: 'Mount Everest Region',
    description: 'Himalayas including Everest Base Camp',
    lat: 27.9881,
    lng: 86.9250,
    areaKm: 30
  },
  // Demo locations for different use cases
  tuscanyHills: {
    name: 'Tuscan Hills',
    description: 'Rolling hills of Tuscany, Italy',
    lat: 43.3186,
    lng: 11.3306,
    areaKm: 10
  },
  scottishHighlands: {
    name: 'Scottish Highlands',
    description: 'Highlands near Fort William, Scotland',
    lat: 56.8198,
    lng: -5.1052,
    areaKm: 15
  }
}

// Helper to get preset by key
export function getPreset(key: keyof typeof presetLocations) {
  return presetLocations[key]
}

// Helper to create custom location config
export function createLocationConfig(
  lat: number,
  lng: number,
  areaKm: number = 10,
  resolution: number = 64,
  verticalExaggeration: number = 2.0
): TerrainSettings['realworld'] {
  return {
    lat,
    lng,
    areaKm,
    resolution,
    verticalExaggeration
  }
}
