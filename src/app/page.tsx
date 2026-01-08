'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Header } from '@/components/ui/Header'
import { HeroOverlay } from '@/components/ui/HeroOverlay'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { InquireModal } from '@/components/ui/InquireModal'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { ExploreHints } from '@/components/ui/ExploreHints'
import { Location } from '@/config/locations'

// Dynamically import the 3D scene to avoid SSR issues
const TerrainScene = dynamic(
  () => import('@/components/scene/TerrainScene').then(mod => mod.TerrainScene),
  {
    ssr: false,
    loading: () => null
  }
)

export default function Home() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)

  // UI states
  const [isExploring, setIsExploring] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [inquireModalOpen, setInquireModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // Handle explore button click
  const handleExplore = useCallback(() => {
    setIsExploring(true)
  }, [])

  // Handle audio toggle
  const handleToggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev)
  }, [])

  // Handle inquire modal
  const handleOpenInquire = useCallback(() => {
    setInquireModalOpen(true)
  }, [])

  const handleCloseInquire = useCallback(() => {
    setInquireModalOpen(false)
  }, [])

  // Handle location selection from 3D scene
  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location)
    console.log('Selected location:', location.name)
  }, [])

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Loading Screen */}
      <LoadingScreen
        progress={Math.min(100, Math.floor(loadProgress))}
        isLoading={isLoading}
      />

      {/* 3D Scene */}
      <TerrainScene
        onLocationSelect={handleLocationSelect}
        isExploring={isExploring}
      />

      {/* Header */}
      <Header
        onInquire={handleOpenInquire}
        isExploring={isExploring}
      />

      {/* Hero Overlay (visible before exploring) */}
      <HeroOverlay
        onExplore={handleExplore}
        onToggleAudio={handleToggleAudio}
        isVisible={!isLoading && !isExploring}
        audioEnabled={audioEnabled}
      />

      {/* Explore Hints (visible when exploring starts) */}
      <ExploreHints isVisible={isExploring} />

      {/* Inquire Modal */}
      <InquireModal
        isOpen={inquireModalOpen}
        onClose={handleCloseInquire}
      />

      {/* Cookie Consent */}
      <CookieConsent />

      {/* Selected location info (optional) */}
      {selectedLocation && isExploring && (
        <div className="absolute bottom-8 left-8 z-40 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
          <h3 className="font-serif text-lg text-gray-900 mb-1">
            {selectedLocation.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {selectedLocation.description}
          </p>
        </div>
      )}
    </main>
  )
}
