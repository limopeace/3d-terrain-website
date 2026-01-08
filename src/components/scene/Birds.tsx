'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BirdData {
  offset: number
  speed: number
  radius: number
  height: number
  wingSpeed: number
}

interface BirdProps {
  data: BirdData
}

function Bird({ data }: BirdProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftWingRef = useRef<THREE.Mesh>(null)
  const rightWingRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * data.speed + data.offset

      // Circular flight path
      groupRef.current.position.x = Math.sin(t) * data.radius
      groupRef.current.position.z = Math.cos(t) * data.radius
      groupRef.current.position.y = data.height + Math.sin(t * 2) * 3

      // Face direction of movement
      groupRef.current.rotation.y = t + Math.PI / 2

      // Wing flapping
      if (leftWingRef.current && rightWingRef.current) {
        const wingAngle = Math.sin(state.clock.elapsedTime * data.wingSpeed) * 0.5
        leftWingRef.current.rotation.z = wingAngle + 0.3
        rightWingRef.current.rotation.z = -wingAngle - 0.3
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>

      {/* Head */}
      <mesh position={[0.35, 0.05, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>

      {/* Left Wing */}
      <mesh
        ref={leftWingRef}
        position={[0, 0.1, 0.2]}
        rotation={[0, 0, 0.3]}
      >
        <boxGeometry args={[0.4, 0.02, 0.8]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Right Wing */}
      <mesh
        ref={rightWingRef}
        position={[0, 0.1, -0.2]}
        rotation={[0, 0, -0.3]}
      >
        <boxGeometry args={[0.4, 0.02, 0.8]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Tail */}
      <mesh position={[-0.35, 0, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
    </group>
  )
}

interface BirdsProps {
  count?: number
}

export function Birds({ count = 8 }: BirdsProps) {
  const birds = useMemo(() => {
    const result: BirdData[] = []

    for (let i = 0; i < count; i++) {
      result.push({
        offset: i * ((Math.PI * 2) / count),
        speed: 0.15 + Math.random() * 0.1,
        radius: 40 + Math.random() * 30,
        height: 35 + Math.random() * 20,
        wingSpeed: 10 + Math.random() * 5
      })
    }

    return result
  }, [count])

  return (
    <group>
      {birds.map((bird, i) => (
        <Bird key={i} data={bird} />
      ))}
    </group>
  )
}
