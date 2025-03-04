'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUniversalAccess, FaTextHeight, FaAdjust, FaTimes } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [highContrast, setHighContrast] = useState(false)

  // 应用高对比度模式
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('high-contrast', highContrast)
    }
  }, [highContrast])

  // 调整字体大小
  const adjustFontSize = (scale: number) => {
    const newSize = fontSize + scale
    if (newSize >= 0.8 && newSize <= 1.5) {
      setFontSize(newSize)
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--font-scale', newSize.toString())
      }
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 accessibility-widget">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors text-white"
        aria-label="Accessibility Options"
      >
        <FaUniversalAccess size={24} className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-4 w-[300px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Accessibility Options</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close accessibility menu"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaTextHeight className="text-xl" />
                  <span className="text-base">Font Size</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => adjustFontSize(-0.1)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-lg"
                    aria-label="Decrease font size"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => adjustFontSize(0.1)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-lg"
                    aria-label="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaAdjust className="text-xl" />
                  <span className="text-base">High Contrast</span>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    highContrast ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle high contrast"
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      highContrast ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 更新底部安全区域 */}
            <div className="h-[env(safe-area-inset-bottom)] md:hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 