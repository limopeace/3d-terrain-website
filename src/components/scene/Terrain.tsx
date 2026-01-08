'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { generateElevation } from '@/lib/noise'

const TERRAIN_SIZE = 200
const SEGMENTS = 128

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, SEGMENTS, SEGMENTS)
    const positions = geo.attributes.position.array as Float32Array
    const colors = new Float32Array(positions.length)

    // Apply elevation and colors
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]

      // Generate height
      const height = generateElevation(x, y)
      positions[i + 2] = height

      // Calculate color based on height
      const colorIndex = i
      if (height < 3) {
        // Valley - dark forest
        colors[colorIndex] = 0.29
        colors[colorIndex + 1] = 0.40
        colors[colorIndex + 2] = 0.25
      } else if (height < 8) {
        // Low hills
        colors[colorIndex] = 0.34
        colors[colorIndex + 1] = 0.49
        colors[colorIndex + 2] = 0.30
      } else if (height < 15) {
        // Mid elevation
        colors[colorIndex] = 0.42
        colors[colorIndex + 1] = 0.56
        colors[colorIndex + 2] = 0.35
      } else if (height < 22) {
        // High hills
        colors[colorIndex] = 0.55
        colors[colorIndex + 1] = 0.60
        colors[colorIndex + 2] = 0.42
      } else if (height < 28) {
        // Near peak
        colors[colorIndex] = 0.66
        colors[colorIndex + 1] = 0.66
        colors[colorIndex + 2] = 0.60
      } else {
        // Peak
        colors[colorIndex] = 0.77
        colors[colorIndex + 1] = 0.77
        colors[colorIndex + 2] = 0.72
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    return geo
  }, [])

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      castShadow
    >
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
