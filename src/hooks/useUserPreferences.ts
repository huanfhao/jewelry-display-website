'use client'

import { useState, useEffect } from 'react'
import { userPreferences } from '@/lib/userPreferences'
import { UserPreferences } from '@/types/user'

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({})

  useEffect(() => {
    if (userPreferences) {
      setPreferences(userPreferences.getPreferences())
    }
  }, [])

  const updatePreferences = () => {
    if (userPreferences) {
      setPreferences(userPreferences.getPreferences())
    }
  }

  return {
    preferences,
    trackPageVisit: (path: string) => {
      userPreferences?.trackPageVisit(path)
      updatePreferences()
    },
    trackProductView: (productId: string) => {
      userPreferences?.trackProductView(productId)
      updatePreferences()
    },
    trackSearch: (searchTerm: string) => {
      userPreferences?.trackSearch(searchTerm)
      updatePreferences()
    },
    updateCategoryPreference: (category: string) => {
      userPreferences?.updateCategoryPreference(category)
      updatePreferences()
    },
    setTheme: (theme: 'light' | 'dark') => {
      userPreferences?.setTheme(theme)
      updatePreferences()
    },
    setLanguage: (language: string) => {
      userPreferences?.setLanguage(language)
      updatePreferences()
    },
    clearPreferences: () => {
      userPreferences?.clearPreferences()
      updatePreferences()
    }
  }
} 