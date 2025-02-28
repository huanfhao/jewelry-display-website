'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import LoadingIndicator from '@/components/ui/LoadingIndicator'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoadingIndicator />
      {children}
      <Toaster />
    </SessionProvider>
  )
} 