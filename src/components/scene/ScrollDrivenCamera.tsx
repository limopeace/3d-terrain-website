'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { CameraKeyframe } from '@/config/narrative'

interface ScrollDrivenCameraProps {
  keyframes: CameraKeyframe[]
  enabled?: boolean
}

/**
 * Scroll-driven camera that interpolates between keyframes based on scroll position
 * Uses @react-three/drei useScroll hook for scroll tracking
 */
export function ScrollDrivenCamera({ keyframes, enabled = true }: ScrollDrivenCameraProps) {
  const { camera } = useThree()
  const scroll = useScroll()

  // Refs for smooth interpolation
  const currentPosition = useRef(new THREE.Vector3())
  const currentTarget = useRef(new THREE.Vector3())
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())

  // Sort keyframes by offset
  const sortedKeyframes = useMemo(() => {
    return [...keyframes].sort((a, b) => a.offset - b.offset)
  }, [keyframes])

  // Find keyframes surrounding current scroll position
  const findKeyframeRange = (offset: number) => {
    let before = sortedKeyframes[0]
    let after = sortedKeyframes[sortedKeyframes.length - 1]

    for (let i = 0; i < sortedKeyframes.length - 1; i++) {
      if (sortedKeyframes[i].offset <= offset && sortedKeyframes[i + 1].offset >= offset) {
        before = sortedKeyframes[i]
        after = sortedKeyframes[i + 1]
        break
      }
    }

    return { before, after }
  }

  // Interpolate between keyframes
  const interpolateKeyframes = (offset: number) => {
    const { before, after } = findKeyframeRange(offset)

    // Calculate interpolation factor
    const range = after.offset - before.offset
    const t = range > 0 ? (offset - before.offset) / range : 0

    // Use smooth easing
    const eased = easeInOutCubic(t)

    // Interpolate position
    targetPosition.current.set(
      THREE.MathUtils.lerp(before.position[0], after.position[0], eased),
      THREE.MathUtils.lerp(before.position[1], after.position[1], eased),
      THREE.MathUtils.lerp(before.position[2], after.position[2], eased)
    )

    // Interpolate target
    targetLookAt.current.set(
      THREE.MathUtils.lerp(before.target[0], after.target[0], eased),
      THREE.MathUtils.lerp(before.target[1], after.target[1], eased),
      THREE.MathUtils.lerp(before.target[2], after.target[2], eased)
    )

    // Interpolate FOV if defined
    if (before.fov !== undefined && after.fov !== undefined && camera instanceof THREE.PerspectiveCamera) {
      const targetFov = THREE.MathUtils.lerp(before.fov, after.fov, eased)
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.1)
      camera.updateProjectionMatrix()
    }
  }

  useFrame((_, delta) => {
    if (!enabled) return

    // Get current scroll offset (0 to 1)
    const offset = scroll.offset

    // Calculate target position based on scroll
    interpolateKeyframes(offset)

    // Smoothly interpolate camera position
    const lerpFactor = 1 - Math.pow(0.001, delta)
    currentPosition.current.lerp(targetPosition.current, lerpFactor)
    currentTarget.current.lerp(targetLookAt.current, lerpFactor)

    // Apply to camera
    camera.position.copy(currentPosition.current)
    camera.lookAt(currentTarget.current)
  })

  return null
}

// Easing functions
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Hook to get scroll progress in a component outside ScrollControls
export function useScrollProgress() {
  const scroll = useScroll()
  return {
    offset: scroll.offset,      // 0-1 overall progress
    delta: scroll.delta,        // Change since last frame
    pages: scroll.pages,        // Total pages
    visible: (start: number, end: number) => {
      return scroll.offset >= start && scroll.offset <= end
    },
    range: (start: number, end: number) => {
      const range = end - start
      const progress = (scroll.offset - start) / range
      return Math.max(0, Math.min(1, progress))
    }
  }
}

/**
 * Alternative: Path-based camera that follows a 3D curve
 */
interface PathCameraProps {
  points: THREE.Vector3[] | [number, number, number][]
  lookAhead?: number  // How far ahead to look (0-1)
  enabled?: boolean
}

export function PathCamera({ points, lookAhead = 0.05, enabled = true }: PathCameraProps) {
  const { camera } = useThree()
  const scroll = useScroll()

  // Create spline curve from points
  const curve = useMemo(() => {
    const vec3Points = points.map(p =>
      p instanceof THREE.Vector3 ? p : new THREE.Vector3(p[0], p[1], p[2])
    )
    return new THREE.CatmullRomCurve3(vec3Points, false, 'centripetal')
  }, [points])

  const currentPos = useRef(new THREE.Vector3())
  const targetPos = useRef(new THREE.Vector3())
  const lookAtPos = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    if (!enabled) return

    const offset = scroll.offset

    // Get position on curve
    curve.getPoint(offset, targetPos.current)

    // Get look-at position (slightly ahead on curve)
    const lookOffset = Math.min(offset + lookAhead, 1)
    curve.getPoint(lookOffset, lookAtPos.current)

    // Smooth interpolation
    const lerpFactor = 1 - Math.pow(0.001, delta)
    currentPos.current.lerp(targetPos.current, lerpFactor)

    camera.position.copy(currentPos.current)
    camera.lookAt(lookAtPos.current)
  })

  return null
}

// Debug helper to visualize camera path
interface CameraPathHelperProps {
  keyframes: CameraKeyframe[]
  visible?: boolean
}

export function CameraPathHelper({ keyframes, visible = false }: CameraPathHelperProps) {
  if (!visible) return null

  const points = keyframes.map(kf => new THREE.Vector3(...kf.position))

  return (
    <group>
      {/* Keyframe markers */}
      {keyframes.map((kf, i) => (
        <mesh key={i} position={kf.position}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}

      {/* Target markers */}
      {keyframes.map((kf, i) => (
        <mesh key={`target-${i}`} position={kf.target}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      ))}

      {/* Connection lines between keyframes */}
      {points.length > 1 && points.slice(0, -1).map((point, i) => {
        const next = points[i + 1]
        const midpoint: [number, number, number] = [
          (point.x + next.x) / 2,
          (point.y + next.y) / 2,
          (point.z + next.z) / 2
        ]
        return (
          <mesh key={`line-${i}`} position={midpoint}>
            <sphereGeometry args={[0.3, 4, 4]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
        )
      })}
    </group>
  )
}
