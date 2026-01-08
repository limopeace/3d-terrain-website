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
import { activeSiteConfig } from '@/config/site'

// Dynamically import 3D scenes to avoid SSR issues
const TerrainScene = dynamic(
  () => import('@/components/scene/TerrainScene').then(mod => mod.TerrainScene),
  { ssr: false, loading: () => null }
)

const ScrollytellingScene = dynamic(
  () => import('@/components/scene/ScrollytellingScene').then(mod => mod.ScrollytellingScene),
  { ssr: false, loading: () => null }
)

// Experience modes
type ExperienceMode = 'loading' | 'intro' | 'scrollytelling' | 'exploration'

export default function Home() {
  const config = activeSiteConfig

  // Experience mode state
  const [mode, setMode] = useState<ExperienceMode>('loading')
  const [loadProgress, setLoadProgress] = useState(0)

  // UI states
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [inquireModalOpen, setInquireModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setMode('intro'), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // Handle explore button click - start scrollytelling
  const handleExplore = useCallback(() => {
    if (config.features.enableScrollytelling) {
      setMode('scrollytelling')
    } else {
      setMode('exploration')
    }
  }, [config.features.enableScrollytelling])

  // Handle switching to free exploration
  const handleSwitchToExploration = useCallback(() => {
    setMode('exploration')
  }, [])

  // Handle CTA clicks from narrative
  const handleCtaClick = useCallback((action: string, target?: string) => {
    switch (action) {
      case 'modal':
        setInquireModalOpen(true)
        break
      case 'scroll':
        // Continue scrolling (handled by scroll behavior)
        break
      case 'link':
        if (target) window.open(target, '_blank')
        break
      case 'explore':
        setMode('exploration')
        break
    }
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

  // Derived states
  const isLoading = mode === 'loading'
  const showHero = mode === 'intro'
  const isScrollytelling = mode === 'scrollytelling'
  const isExploring = mode === 'exploration'

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Loading Screen */}
      <LoadingScreen
        progress={Math.min(100, Math.floor(loadProgress))}
        isLoading={isLoading}
      />

      {/* 3D Scene - Either Scrollytelling or Exploration */}
      {isScrollytelling ? (
        <ScrollytellingScene
          narrative={config.narrative}
          onCtaClick={handleCtaClick}
          showDebugPath={false}
        />
      ) : (
        <TerrainScene
          onLocationSelect={handleLocationSelect}
          isExploring={isExploring}
        />
      )}

      {/* Header - always visible except during loading */}
      {!isLoading && (
        <Header
          onInquire={handleOpenInquire}
          isExploring={isExploring || isScrollytelling}
          brandName={config.brand.name}
        />
      )}

      {/* Hero Overlay (visible only in intro mode) */}
      <HeroOverlay
        onExplore={handleExplore}
        onToggleAudio={handleToggleAudio}
        isVisible={showHero}
        audioEnabled={audioEnabled}
        brand={{
          tagline: config.narrative.subtitle || config.brand.tagline,
          headline: config.narrative.title || config.brand.name,
          description: config.narrative.sections[0]?.description || config.description
        }}
      />

      {/* Explore Hints (visible in exploration mode) */}
      <ExploreHints isVisible={isExploring} />

      {/* Mode switcher (visible in scrollytelling and exploration) */}
      {(isScrollytelling || isExploring) && config.features.enableExploration && (
        <ModeSwitcher
          currentMode={mode}
          onSwitchToScrollytelling={() => setMode('scrollytelling')}
          onSwitchToExploration={handleSwitchToExploration}
          showScrollytelling={config.features.enableScrollytelling}
        />
      )}

      {/* Inquire Modal */}
      <InquireModal
        isOpen={inquireModalOpen}
        onClose={handleCloseInquire}
      />

      {/* Cookie Consent */}
      <CookieConsent />

      {/* Selected location info (only in exploration mode) */}
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

// Mode switcher component
function ModeSwitcher({
  currentMode,
  onSwitchToScrollytelling,
  onSwitchToExploration,
  showScrollytelling
}: {
  currentMode: ExperienceMode
  onSwitchToScrollytelling: () => void
  onSwitchToExploration: () => void
  showScrollytelling: boolean
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full p-1">
        {showScrollytelling && (
          <button
            onClick={onSwitchToScrollytelling}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              currentMode === 'scrollytelling'
                ? 'bg-white text-gray-900'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Story
          </button>
        )}
        <button
          onClick={onSwitchToExploration}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
            currentMode === 'exploration'
              ? 'bg-white text-gray-900'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Explore
        </button>
      </div>
    </div>
  )
}
