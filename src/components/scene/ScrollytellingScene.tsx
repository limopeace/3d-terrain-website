'use client'

import { Suspense, useState, useCallback, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Environment, Preload } from '@react-three/drei'
import { Terrain } from './Terrain'
import { RealWorldTerrain } from './RealWorldTerrain'
import { Vegetation } from './Vegetation'
import { Clouds } from './Clouds'
import { Birds } from './Birds'
import { ScrollDrivenCamera, CameraPathHelper } from './ScrollDrivenCamera'
import { NarrativeConfig, defaultNarrative } from '@/config/narrative'
import { terrainSettings } from '@/config/terrain'
import { NarrativeOverlay, ScrollProgressIndicator, ScrollHint } from '@/components/ui/NarrativeOverlay'

interface ScrollytellingSceneProps {
  narrative?: NarrativeConfig
  onCtaClick?: (action: string, target?: string) => void
  showDebugPath?: boolean
}

/**
 * Main scrollytelling scene component
 * Wraps 3D scene with ScrollControls and handles narrative overlay
 */
export function ScrollytellingScene({
  narrative = defaultNarrative,
  onCtaClick,
  showDebugPath = false
}: ScrollytellingSceneProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [terrainLoaded, setTerrainLoaded] = useState(false)

  // Handle scroll updates from inside the Canvas
  const handleScrollUpdate = useCallback((progress: number) => {
    setScrollProgress(progress)
  }, [])

  // Terrain render based on settings
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
          onLoad={() => setTerrainLoaded(true)}
        />
      )
    }
    return <Terrain />
  }

  return (
    <div className="absolute inset-0">
      {/* 3D Canvas with Scroll Controls */}
      <Canvas
        camera={{
          position: narrative.cameraKeyframes[0].position,
          fov: narrative.cameraKeyframes[0].fov || 45,
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
        <ScrollControls
          pages={narrative.totalPages}
          damping={narrative.damping}
          distance={1}
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
            <hemisphereLight args={['#87ceeb', '#456a4b', 0.3]} />

            {/* Environment */}
            <Environment preset="forest" background={false} />
            <fog attach="fog" args={['#c9d9e8', 80, 300]} />

            {/* Terrain */}
            {renderTerrain()}

            {/* Scene Elements */}
            <Vegetation />
            <Clouds />
            <Birds count={6} />

            {/* Scroll-driven Camera */}
            <ScrollDrivenCamera keyframes={narrative.cameraKeyframes} />

            {/* Debug: Camera path visualization */}
            <CameraPathHelper keyframes={narrative.cameraKeyframes} visible={showDebugPath} />

            {/* POI Markers (if defined) */}
            {narrative.pois.map(poi => (
              <POIMarker
                key={poi.id}
                position={poi.position}
                name={poi.name}
                highlightRange={poi.highlightAtScroll}
              />
            ))}

            {/* Scroll Progress Tracker */}
            <ScrollProgressTracker onUpdate={handleScrollUpdate} />

            <Preload all />
          </Suspense>
        </ScrollControls>
      </Canvas>

      {/* HTML Overlays (outside Canvas) */}
      <NarrativeOverlay
        sections={narrative.sections}
        scrollProgress={scrollProgress}
        onCtaClick={onCtaClick}
      />

      {/* Progress indicator */}
      <ScrollProgressIndicator
        progress={scrollProgress}
        sections={narrative.sections}
      />

      {/* Scroll hint (shows at start) */}
      <ScrollHint visible={scrollProgress < 0.05 && terrainLoaded} />
    </div>
  )
}

/**
 * Component to track scroll progress inside ScrollControls
 */
function ScrollProgressTracker({ onUpdate }: { onUpdate: (progress: number) => void }) {
  const scroll = useScroll()

  useFrame(() => {
    onUpdate(scroll.offset)
  })

  return null
}

/**
 * POI Marker that highlights based on scroll position
 */
interface POIMarkerProps {
  position: [number, number, number]
  name: string
  highlightRange?: [number, number]
}

function POIMarker({ position, name, highlightRange }: POIMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()

  useFrame((state) => {
    if (!meshRef.current) return

    const isHighlighted = highlightRange
      ? scroll.offset >= highlightRange[0] && scroll.offset <= highlightRange[1]
      : false

    // Animate scale and glow when highlighted
    const targetScale = isHighlighted ? 1.5 : 1
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale } as THREE.Vector3,
      0.1
    )

    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3
  })

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Marker sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#d4a574"
          emissive="#d4a574"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Ground glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] + 0.1, 0]}>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshBasicMaterial color="#d4a574" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}

/**
 * Simpler version without scrollytelling (exploration mode)
 */
export function ExplorationScene({
  onLocationSelect
}: {
  onLocationSelect?: (location: unknown) => void
}) {
  const [terrainLoaded, setTerrainLoaded] = useState(false)

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
          onLoad={() => setTerrainLoaded(true)}
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
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[50, 80, 30]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <hemisphereLight args={['#87ceeb', '#456a4b', 0.3]} />

          <Environment preset="forest" background={false} />
          <fog attach="fog" args={['#c9d9e8', 80, 300]} />

          {renderTerrain()}
          <Vegetation />
          <Clouds />
          <Birds count={8} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Need to import THREE for the POI marker
import * as THREE from 'three'
