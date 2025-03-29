'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  cookieConsent: {
    essential: boolean
    preferences: boolean
    analytics: boolean
    marketing: boolean
  }
  [key: string]: any
}

interface UserPreferencesStore {
  preferences: UserPreferences
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void
}

export const useUserPreferences = create<UserPreferencesStore>()(
  persist(
    (set) => ({
      preferences: {
        theme: 'light',
        language: 'en',
        cookieConsent: {
          essential: true,
          preferences: false,
          analytics: false,
          marketing: false
        }
      },
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        }))
    }),
    {
      name: 'user-preferences'
    }
  )
) 