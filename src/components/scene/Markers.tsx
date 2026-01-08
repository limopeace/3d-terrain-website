'use client'

import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { locations, Location } from '@/config/locations'
import { brand } from '@/config/brand'

interface MarkerProps {
  location: Location
  onSelect: (location: Location) => void
  isExploring: boolean
}

function Marker({ location, onSelect, isExploring }: MarkerProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = location.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
    if (ringRef.current) {
      // Rotating ring
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  if (!isExploring) return null

  return (
    <group position={[location.position[0], 0, location.position[2]]}>
      {/* Marker sphere */}
      <mesh
        ref={meshRef}
        position={[0, location.position[1], 0]}
        onClick={() => onSelect(location)}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? brand.colors.accent : '#ffffff'}
          emissive={hovered ? brand.colors.accent : '#ffffff'}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Animated ring */}
      <mesh
        ref={ringRef}
        position={[0, location.position[1], 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.8, 2.2, 32]} />
        <meshBasicMaterial
          color={hovered ? brand.colors.accent : '#ffffff'}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical beam */}
      <mesh position={[0, location.position[1] / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, location.position[1], 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, location.position[1] + 3, 0]}
        center
        distanceFactor={20}
        occlude={false}
        style={{
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0.8,
          transition: 'opacity 0.2s'
        }}
      >
        <div
          className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium tracking-wide"
          style={{
            backgroundColor: hovered ? brand.colors.accent : 'rgba(255,255,255,0.95)',
            color: hovered ? '#ffffff' : brand.colors.dark,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {location.name}
        </div>
      </Html>
    </group>
  )
}

interface MarkersProps {
  onSelect: (location: Location) => void
  isExploring: boolean
}

export function Markers({ onSelect, isExploring }: MarkersProps) {
  return (
    <group>
      {locations.map((location) => (
        <Marker
          key={location.id}
          location={location}
          onSelect={onSelect}
          isExploring={isExploring}
        />
      ))}
    </group>
  )
}
