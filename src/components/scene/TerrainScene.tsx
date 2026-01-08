'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import { Suspense, useState, useCallback } from 'react'
import { Terrain } from './Terrain'
import { RealWorldTerrain } from './RealWorldTerrain'
import { Vegetation } from './Vegetation'
import { Clouds } from './Clouds'
import { Birds } from './Birds'
import { Markers } from './Markers'
import { CameraControls } from './CameraControls'
import { Location } from '@/config/locations'
import { terrainSettings } from '@/config/terrain'

interface TerrainSceneProps {
  onLocationSelect?: (location: Location) => void
  isExploring: boolean
}

export function TerrainScene({ onLocationSelect, isExploring }: TerrainSceneProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location)
    setIsAnimating(true)
    onLocationSelect?.(location)

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 2000)
  }, [onLocationSelect])

  // Determine which terrain to render
  const renderTerrain = () => {
    if (terrainSettings.type === 'realworld' && terrainSettings.realworld) {
      const { lat, lng, areaKm, resolution, verticalExaggeration } = terrainSettings.realworld
      return (
        <RealWorldTerrain
          lat={lat}
          lng={lng}
          areaKm={areaKm}
          resolution={resolution}
          scale={200}
          verticalExaggeration={verticalExaggeration}
          apiProvider={terrainSettings.apiProvider}
          useCache={terrainSettings.useCache}
        />
      )
    }
    return <Terrain />
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 80, 120],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[50, 80, 30]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={200}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          <hemisphereLight
            args={['#87ceeb', '#456a4b', 0.3]}
          />

          {/* Environment */}
          <Environment preset="forest" background={false} />
          <fog attach="fog" args={['#c9d9e8', 80, 300]} />

          {/* Terrain - Procedural or Real-World */}
          {renderTerrain()}

          {/* Scene Elements */}
          <Vegetation />
          <Clouds />
          <Birds count={8} />
          <Markers
            onSelect={handleLocationSelect}
            isExploring={isExploring}
          />

          {/* Camera */}
          <CameraControls
            target={selectedLocation}
            isAnimating={isAnimating}
            isExploring={isExploring}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
