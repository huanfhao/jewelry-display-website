'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages } from './config'

// 初始化 i18next
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // 让浏览器语言检测器工作
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: languages
  })

export function useTranslation(lng: string, ns?: string) {
  const ret = useTranslationOrg(ns)
  const { i18n } = ret

  useEffect(() => {
    if (i18n.resolvedLanguage === lng) return
    i18n.changeLanguage(lng)
  }, [lng, i18n])

  return ret
} 