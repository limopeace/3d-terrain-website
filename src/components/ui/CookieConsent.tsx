'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { brand } from '@/config/brand'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[80] p-4 md:p-6"
        >
          <div
            className="max-w-4xl mx-auto rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: brand.colors.dark }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Close button */}
              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 md:relative md:top-auto md:right-auto md:order-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="flex-1 pr-8 md:pr-0">
                <h3 className="text-white font-medium mb-2">
                  We value your privacy
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  This website or its third-party tools process personal data.
                  You can opt out of the sharing of your personal information
                  by clicking on the &quot;Do Not Share My Personal Information&quot; link.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 md:order-2">
                <motion.button
                  onClick={handleDecline}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 rounded-full text-white/80 text-sm border border-white/20 hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Do Not Share My Personal Information
                </motion.button>
                <motion.button
                  onClick={handleAccept}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 rounded-full text-white text-sm font-medium whitespace-nowrap"
                  style={{ backgroundColor: brand.colors.primary }}
                >
                  Accept
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
