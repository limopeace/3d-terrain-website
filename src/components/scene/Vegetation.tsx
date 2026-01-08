'use client'

import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import * as THREE from 'three'
import { generateTreePositions } from '@/lib/noise'

const TREE_COUNT = 600
const BUSH_COUNT = 400
const TERRAIN_SIZE = 200

// Simple tree geometry (cone + cylinder)
function TreeGeometry() {
  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#2d5a2d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[0.9, 2, 8]} />
        <meshStandardMaterial color="#3a6b3a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <coneGeometry args={[0.5, 1.5, 8]} />
        <meshStandardMaterial color="#4a7d4a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Bush geometry (spheres)
function BushGeometry() {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#3d6b3d" roughness={0.85} />
      </mesh>
      <mesh position={[0.4, 0.2, 0.2]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#4a7a4a" roughness={0.85} />
      </mesh>
      <mesh position={[-0.3, 0.1, 0.3]} castShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.85} />
      </mesh>
    </group>
  )
}

export function Vegetation() {
  const treePositions = useMemo(() =>
    generateTreePositions(TREE_COUNT, TERRAIN_SIZE),
    []
  )

  const bushPositions = useMemo(() =>
    generateTreePositions(BUSH_COUNT, TERRAIN_SIZE).map(p => ({
      ...p,
      scale: p.scale * 0.5,
      position: [p.position[0], p.position[1] + 0.3, p.position[2]] as [number, number, number]
    })),
    []
  )

  return (
    <group>
      {/* Trees */}
      {treePositions.slice(0, 200).map((tree, i) => (
        <group
          key={`tree-${i}`}
          position={tree.position}
          scale={tree.scale}
          rotation={[0, tree.rotation, 0]}
        >
          <TreeGeometry />
        </group>
      ))}

      {/* Bushes */}
      {bushPositions.slice(0, 150).map((bush, i) => (
        <group
          key={`bush-${i}`}
          position={bush.position}
          scale={bush.scale}
          rotation={[0, bush.rotation, 0]}
        >
          <BushGeometry />
        </group>
      ))}
    </group>
  )
}
