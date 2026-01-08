'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { brand } from '@/config/brand'

interface HeroOverlayProps {
  onExplore: () => void
  onToggleAudio: () => void
  isVisible: boolean
  audioEnabled: boolean
}

export function HeroOverlay({
  onExplore,
  onToggleAudio,
  isVisible,
  audioEnabled
}: HeroOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center"
        >
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

          {/* Content */}
          <div className="relative text-center px-4">
            {/* Brand icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-white/40 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8 text-white"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path d="M12 3L2 12h3v9h14v-9h3L12 3z" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/70 text-sm md:text-base tracking-[0.4em] uppercase mb-2 font-light"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {brand.tagline}
              <sup className="text-xs ml-1">{brand.taglineSuffix}</sup>
            </motion.p>

            {/* Headline - animated letters */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-white text-4xl md:text-6xl lg:text-7xl font-serif tracking-wide mb-6"
              style={{ textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
            >
              {brand.headline.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4">
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8 + (wordIndex * 0.1) + (charIndex * 0.03),
                        duration: 0.4
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="text-white/80 text-base md:text-lg mb-10 font-light"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {brand.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="space-y-4 pointer-events-auto"
            >
              <motion.button
                onClick={onExplore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-4 rounded-full text-white font-medium tracking-wide overflow-hidden group"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <span className="relative z-10">Explore the map</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>

              <motion.button
                onClick={onToggleAudio}
                whileHover={{ opacity: 1 }}
                className="block mx-auto text-white/50 hover:text-white/80 text-sm transition-colors"
              >
                {audioEnabled ? 'Mute audio' : 'Start without audio'}
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-white/80"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
