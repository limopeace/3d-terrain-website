'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Location } from '@/config/locations'

interface CameraControlsProps {
  target: Location | null
  isAnimating: boolean
  isExploring: boolean
}

export function CameraControls({ target, isAnimating, isExploring }: CameraControlsProps) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const targetPosition = useRef(new THREE.Vector3(0, 80, 120))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))

  // Initial camera position for intro
  useEffect(() => {
    if (!isExploring) {
      camera.position.set(0, 100, 150)
      camera.lookAt(0, 0, 0)
    }
  }, [camera, isExploring])

  // Update target when location is selected
  useEffect(() => {
    if (target && isAnimating) {
      targetPosition.current.set(...target.cameraPosition)
      targetLookAt.current.set(...target.position)
    }
  }, [target, isAnimating])

  // Animate camera to target
  useFrame((state, delta) => {
    if (isAnimating && target) {
      // Smooth camera movement
      camera.position.lerp(targetPosition.current, delta * 2)

      // Smooth look at
      const currentLookAt = new THREE.Vector3()
      camera.getWorldDirection(currentLookAt)
      currentLookAt.add(camera.position)

      const newLookAt = currentLookAt.lerp(targetLookAt.current, delta * 2)

      // Update controls target
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, delta * 2)
      }
    }
  })

  // Intro animation - zoom into explore mode
  useFrame((state, delta) => {
    if (isExploring && !isAnimating && !target) {
      // Gentle drift towards default explore position
      const explorePosition = new THREE.Vector3(30, 50, 80)
      if (camera.position.distanceTo(explorePosition) > 1) {
        camera.position.lerp(explorePosition, delta * 0.5)
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={25}
      maxDistance={180}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 8}
      enablePan={true}
      panSpeed={0.5}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      target={[0, 5, 0]}
      enabled={isExploring && !isAnimating}
    />
  )
}
