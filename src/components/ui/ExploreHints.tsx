'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface ExploreHintsProps {
  isVisible: boolean
}

export function ExploreHints({ isVisible }: ExploreHintsProps) {
  const [showHints, setShowHints] = useState(true)

  useEffect(() => {
    if (isVisible) {
      // Auto-hide hints after 5 seconds
      const timer = setTimeout(() => setShowHints(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && showHints && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
        >
          <div className="text-center">
            {/* Hints container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4"
            >
              {/* Drag hint */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center mb-2">
                    <motion.svg
                      animate={{ x: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </motion.svg>
                  </div>
                  <p className="text-white/90 text-sm font-medium">Drag</p>
                  <p className="text-white/60 text-xs">to move</p>
                </div>

                <div className="w-px h-16 bg-white/20" />

                {/* Scroll hint */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center mb-2">
                    <motion.svg
                      animate={{ y: [0, 3, 0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </motion.svg>
                  </div>
                  <p className="text-white/90 text-sm font-medium">Scroll</p>
                  <p className="text-white/60 text-xs">to zoom</p>
                </div>
              </div>

              {/* Main instruction */}
              <div className="border-t border-white/20 pt-6">
                <p className="text-white/90 text-sm mb-1">
                  Explore the landscape by holding
                </p>
                <p className="text-white/90 text-sm mb-3">
                  and dragging the cursor
                </p>
                <p className="text-white/60 text-xs">
                  Dive into the landscape by scrolling
                </p>
              </div>
            </motion.div>

            {/* Dismiss button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setShowHints(false)}
              className="mt-4 text-white/50 text-sm hover:text-white/80 transition-colors pointer-events-auto"
            >
              Got it
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
