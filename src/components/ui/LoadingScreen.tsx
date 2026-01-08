'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { brand } from '@/config/brand'

interface LoadingScreenProps {
  progress: number
  isLoading: boolean
}

export function LoadingScreen({ progress, isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: brand.colors.dark }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-10 h-10 text-white/80"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path d="M12 3L2 12h3v9h14v-9h3L12 3z" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/90 text-2xl font-serif tracking-wide mb-8"
          >
            {brand.name}
          </motion.h2>

          {/* Progress bar */}
          <div className="w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: brand.colors.accent }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-white/40 text-sm tracking-wider"
          >
            Loading experience...
          </motion.p>

          {/* Animated dots */}
          <div className="flex gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-1.5 h-1.5 rounded-full bg-white/50"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
