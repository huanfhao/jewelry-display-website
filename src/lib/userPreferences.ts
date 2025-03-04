'use client'

import { UserPreferences } from '@/types/user'
import { getCookie, setCookie } from './cookies'

const PREFERENCES_KEY = 'user-preferences'
const MAX_HISTORY_ITEMS = 10

export class UserPreferencesManager {
  private preferences: UserPreferences
  private debounceTimer: NodeJS.Timeout | null = null

  constructor() {
    this.preferences = this.loadPreferences()
  }

  private loadPreferences(): UserPreferences {
    const stored = getCookie(PREFERENCES_KEY)
    if (!stored) return {}
    
    try {
      const parsed = JSON.parse(stored)
      return this.migratePreferences(parsed)
    } catch (error) {
      console.error('Error parsing preferences:', error)
      return {}
    }
  }

  private migratePreferences(oldPrefs: any): UserPreferences {
    // 处理旧版本的偏好数据结构
    return {
      theme: oldPrefs.theme || 'light',
      language: oldPrefs.language || 'en',
      lastVisited: Array.isArray(oldPrefs.lastVisited) ? oldPrefs.lastVisited : [],
      viewedProducts: Array.isArray(oldPrefs.viewedProducts) ? oldPrefs.viewedProducts : [],
      searchHistory: Array.isArray(oldPrefs.searchHistory) ? oldPrefs.searchHistory : [],
      categoryPreferences: Array.isArray(oldPrefs.categoryPreferences) ? oldPrefs.categoryPreferences : [],
      fontSize: ['small', 'medium', 'large'].includes(oldPrefs.fontSize) ? oldPrefs.fontSize : 'medium',
      cookieConsent: !!oldPrefs.cookieConsent
    }
  }

  private savePreferences() {
    // 防抖保存，避免频繁写入
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    
    this.debounceTimer = setTimeout(() => {
      setCookie(PREFERENCES_KEY, JSON.stringify(this.preferences), 365)
      this.debounceTimer = null
    }, 1000)
  }

  // 记录页面访问
  trackPageVisit(path: string) {
    if (!this.preferences.lastVisited) {
      this.preferences.lastVisited = []
    }

    // 移除重复项并保持最新访问在前
    this.preferences.lastVisited = [
      path,
      ...this.preferences.lastVisited.filter(p => p !== path)
    ].slice(0, MAX_HISTORY_ITEMS)

    this.savePreferences()
  }

  // 记录产品查看
  trackProductView(productId: string) {
    if (!this.preferences.viewedProducts) {
      this.preferences.viewedProducts = []
    }

    this.preferences.viewedProducts = [
      productId,
      ...this.preferences.viewedProducts.filter(p => p !== productId)
    ].slice(0, MAX_HISTORY_ITEMS)

    this.savePreferences()
  }

  // 记录搜索历史
  trackSearch(searchTerm: string) {
    if (!this.preferences.searchHistory) {
      this.preferences.searchHistory = []
    }

    this.preferences.searchHistory = [
      searchTerm,
      ...this.preferences.searchHistory.filter(s => s !== searchTerm)
    ].slice(0, MAX_HISTORY_ITEMS)

    this.savePreferences()
  }

  // 更新类别偏好
  updateCategoryPreference(category: string) {
    if (!this.preferences.categoryPreferences) {
      this.preferences.categoryPreferences = []
    }

    if (!this.preferences.categoryPreferences.includes(category)) {
      this.preferences.categoryPreferences.push(category)
      this.savePreferences()
    }
  }

  // 设置主题
  setTheme(theme: 'light' | 'dark') {
    this.preferences.theme = theme
    this.savePreferences()
  }

  // 设置语言
  setLanguage(language: string) {
    this.preferences.language = language
    this.savePreferences()
  }

  // 获取所有偏好
  getPreferences(): UserPreferences {
    return { ...this.preferences }
  }

  // 获取推荐产品类别
  getRecommendedCategories(): string[] {
    return this.preferences.categoryPreferences || []
  }

  // 获取最近浏览历史
  getRecentViews(): string[] {
    return this.preferences.lastVisited || []
  }

  // 获取搜索历史
  getSearchHistory(): string[] {
    return this.preferences.searchHistory || []
  }

  // 清除所有偏好
  clearPreferences() {
    this.preferences = {}
    this.savePreferences()
  }
}

// 创建单例实例
export const userPreferences = typeof window !== 'undefined' 
  ? new UserPreferencesManager()
  : null 