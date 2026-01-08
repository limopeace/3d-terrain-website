'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CLOUD_COUNT = 15

interface CloudProps {
  position: [number, number, number]
  scale: number
  speed: number
}

function Cloud({ position, scale, speed }: CloudProps) {
  const groupRef = useRef<THREE.Group>(null)
  const initialX = position[0]

  useFrame((state) => {
    if (groupRef.current) {
      // Slow horizontal drift
      groupRef.current.position.x = initialX + Math.sin(state.clock.elapsedTime * speed) * 10
      // Slight vertical bobbing
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 2
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Cloud cluster using spheres */}
      <mesh>
        <sphereGeometry args={[8, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.85}
          roughness={1}
        />
      </mesh>
      <mesh position={[6, -1, 2]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          roughness={1}
        />
      </mesh>
      <mesh position={[-5, -2, 1]}>
        <sphereGeometry args={[7, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.82}
          roughness={1}
        />
      </mesh>
      <mesh position={[3, 2, -2]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.75}
          roughness={1}
        />
      </mesh>
      <mesh position={[-3, 1, 3]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.7}
          roughness={1}
        />
      </mesh>
    </group>
  )
}

export function Clouds() {
  const clouds = useMemo(() => {
    const result: CloudProps[] = []

    for (let i = 0; i < CLOUD_COUNT; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 300,
          50 + Math.random() * 30,
          (Math.random() - 0.5) * 300
        ],
        scale: 0.8 + Math.random() * 1.2,
        speed: 0.02 + Math.random() * 0.03
      })
    }

    return result
  }, [])

  return (
    <group>
      {clouds.map((cloud, i) => (
        <Cloud key={i} {...cloud} />
      ))}
    </group>
  )
}
