'use client'

import { SessionProvider } from 'next-auth/react'
import { useNavigationLoading } from '@/hooks/useNavigationLoading'
import { Toaster } from 'sonner'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  useNavigationLoading()

  return (
    <SessionProvider>
      {children}
      <Toaster richColors position="top-center" />
    </SessionProvider>
  )
} 