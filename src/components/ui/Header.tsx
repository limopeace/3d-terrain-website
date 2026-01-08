'use client'

import { motion } from 'framer-motion'
import { brand } from '@/config/brand'

interface HeaderProps {
  onInquire: () => void
  isExploring: boolean
}

export function Header({ onInquire, isExploring }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          {/* Placeholder logo - replace with actual SVG */}
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6 text-white"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M12 3L2 12h3v9h14v-9h3L12 3z" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </div>
          <span
            className="text-white font-serif text-xl tracking-wide hidden sm:block"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            {brand.name}
          </span>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {isExploring && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/80 hover:text-white text-sm tracking-wide hidden md:block transition-colors"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              Home
            </motion.button>
          )}

          <motion.button
            onClick={onInquire}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full text-white text-sm font-medium tracking-wide transition-all"
            style={{
              backgroundColor: brand.colors.primary,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Inquire
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
