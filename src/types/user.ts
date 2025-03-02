export interface UserPreferences {
  theme?: 'light' | 'dark'
  language?: string
  lastVisited?: string[]
  viewedProducts?: string[]
  searchHistory?: string[]
  categoryPreferences?: string[]
  fontSize?: 'small' | 'medium' | 'large'
  cookieConsent?: boolean
} 