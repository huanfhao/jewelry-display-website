'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { getCookie, setCookie } from '@/lib/cookies'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // 检查是否已经同意 Cookie
    const hasConsented = getCookie('cookie-consent')
    if (!hasConsented) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    setCookie('cookie-consent', 'true', 365) // 365天过期
    setShowBanner(false)
  }

  const handleDecline = () => {
    setCookie('cookie-consent', 'false', 365)
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 safe-area-bottom"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p>
                  We use cookies to enhance your browsing experience, serve personalized 
                  ads or content, and analyze our traffic. By clicking "Accept All", you 
                  consent to our use of cookies.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 