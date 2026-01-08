'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { NarrativeSection } from '@/config/narrative'

interface NarrativeOverlayProps {
  sections: NarrativeSection[]
  scrollProgress: number
  onCtaClick?: (action: string, target?: string) => void
}

/**
 * Overlay component that displays narrative text sections based on scroll position
 */
export function NarrativeOverlay({ sections, scrollProgress, onCtaClick }: NarrativeOverlayProps) {
  // Find active section based on scroll progress
  const activeSection = sections.find(
    s => scrollProgress >= s.scrollStart && scrollProgress <= s.scrollEnd
  )

  // Calculate section visibility (0-1) for animations
  const getSectionProgress = (section: NarrativeSection) => {
    if (scrollProgress < section.scrollStart) return 0
    if (scrollProgress > section.scrollEnd) return 0

    const range = section.scrollEnd - section.scrollStart
    const mid = section.scrollStart + range / 2

    // Fade in during first half, fade out during second half
    if (scrollProgress < mid) {
      return (scrollProgress - section.scrollStart) / (range / 2)
    } else {
      return 1 - (scrollProgress - mid) / (range / 2)
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <AnimatePresence mode="wait">
        {activeSection && (
          <NarrativeSectionView
            key={activeSection.id}
            section={activeSection}
            progress={getSectionProgress(activeSection)}
            onCtaClick={onCtaClick}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface NarrativeSectionViewProps {
  section: NarrativeSection
  progress: number
  onCtaClick?: (action: string, target?: string) => void
}

function NarrativeSectionView({ section, progress, onCtaClick }: NarrativeSectionViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = progress > 0.1

  // Alignment classes
  const alignmentClasses = {
    left: 'items-start text-left pl-8 md:pl-16 lg:pl-24',
    center: 'items-center text-center px-8',
    right: 'items-end text-right pr-8 md:pr-16 lg:pr-24'
  }

  // Theme classes
  const themeClasses = {
    light: 'text-gray-900',
    dark: 'text-white'
  }

  const align = section.align || 'center'
  const theme = section.theme || 'dark'

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 flex flex-col justify-center ${alignmentClasses[align]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient for readability */}
      {theme === 'dark' && (
        <div
          className={`absolute inset-0 ${
            align === 'left'
              ? 'bg-gradient-to-r from-black/50 via-black/30 to-transparent'
              : align === 'right'
              ? 'bg-gradient-to-l from-black/50 via-black/30 to-transparent'
              : 'bg-gradient-to-b from-black/40 via-transparent to-black/40'
          }`}
        />
      )}

      <div className={`relative z-10 max-w-xl ${themeClasses[theme]}`}>
        {/* Subtitle (small text above title) */}
        {section.subtitle && (
          <motion.p
            className="text-sm md:text-base uppercase tracking-[0.3em] mb-2 opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progress, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {section.subtitle}
          </motion.p>
        )}

        {/* Title */}
        <motion.h2
          className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: progress, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {section.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-base md:text-lg lg:text-xl opacity-90 leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: progress * 0.9, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {section.description}
        </motion.p>

        {/* CTA Button */}
        {section.cta && (
          <motion.button
            className={`
              mt-6 px-6 py-3 text-sm uppercase tracking-wider font-medium
              pointer-events-auto cursor-pointer
              transition-all duration-300
              ${theme === 'dark'
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'}
              rounded-sm
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progress, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => onCtaClick?.(section.cta!.action, section.cta!.target)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {section.cta.text}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Alternative: Horizontal scrolling narrative sections
 */
export function HorizontalNarrative({
  sections,
  scrollProgress
}: {
  sections: NarrativeSection[]
  scrollProgress: number
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-10">
      <div className="h-full flex items-center overflow-hidden">
        {sections.map((section, index) => {
          const isActive = scrollProgress >= section.scrollStart && scrollProgress <= section.scrollEnd
          const opacity = isActive ? 1 : 0.3

          return (
            <motion.div
              key={section.id}
              className="flex-shrink-0 px-8 text-white"
              animate={{ opacity }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium">{section.title}</h3>
              <p className="text-sm opacity-70 max-w-xs">{section.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Progress indicator showing current scroll position
 */
export function ScrollProgressIndicator({
  progress,
  sections
}: {
  progress: number
  sections: NarrativeSection[]
}) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20">
      <div className="flex flex-col gap-2">
        {sections.map((section, index) => {
          const isActive = progress >= section.scrollStart && progress <= section.scrollEnd
          const isPast = progress > section.scrollEnd

          return (
            <div
              key={section.id}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isActive ? 'w-3 h-3 bg-white' : isPast ? 'bg-white/60' : 'bg-white/30'}
              `}
              title={section.title}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * Scroll hint at bottom of screen
 */
export function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className="text-sm uppercase tracking-wider mb-2 opacity-70">Scroll to explore</p>
          <motion.div
            className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto flex justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div
              className="w-1 h-2 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
