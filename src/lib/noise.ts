import { createNoise2D } from 'simplex-noise'

// Create noise function with seed for consistent terrain
const noise2D = createNoise2D()

export function generateElevation(x: number, z: number): number {
  // Multi-octave noise for realistic terrain
  const scale1 = 0.015  // Large features
  const scale2 = 0.03   // Medium features
  const scale3 = 0.06   // Small details

  // Layer multiple noise octaves
  const n1 = noise2D(x * scale1, z * scale1) * 15  // Base mountains
  const n2 = noise2D(x * scale2, z * scale2) * 8   // Hills
  const n3 = noise2D(x * scale3, z * scale3) * 3   // Details

  // Combine octaves
  let height = n1 + n2 + n3

  // Create central mountain peak
  const distFromCenter = Math.sqrt(x * x + z * z)
  const centerBoost = Math.max(0, 1 - distFromCenter / 60) * 10
  height += centerBoost

  // Add ridge lines
  const ridgeNoise = Math.abs(noise2D(x * 0.02, z * 0.02))
  height += ridgeNoise * 5

  return Math.max(0, height)
}

export function getTerrainColor(height: number): string {
  // Color gradient based on elevation
  if (height < 3) return '#4a6741'      // Valley - dark forest green
  if (height < 8) return '#567d4d'      // Low hills - forest green
  if (height < 15) return '#6b8e5a'     // Mid elevation - sage
  if (height < 22) return '#8b9a6b'     // High hills - pale sage
  if (height < 28) return '#a8a89a'     // Near peak - gray-green
  return '#c4c4b8'                       // Peak - light gray
}

// Generate tree positions avoiding high elevations
export function generateTreePositions(count: number, terrainSize: number): Array<{
  position: [number, number, number]
  scale: number
  rotation: number
}> {
  const trees: Array<{
    position: [number, number, number]
    scale: number
    rotation: number
  }> = []

  const halfSize = terrainSize / 2

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * terrainSize * 0.9
    const z = (Math.random() - 0.5) * terrainSize * 0.9
    const height = generateElevation(x, z)

    // Skip if too high (no trees on peaks) or too low (water)
    if (height > 20 || height < 1) continue

    // Density decreases with elevation
    const skipChance = height / 25
    if (Math.random() < skipChance) continue

    trees.push({
      position: [x, height, z],
      scale: 0.6 + Math.random() * 0.8,
      rotation: Math.random() * Math.PI * 2,
    })
  }

  return trees
}
