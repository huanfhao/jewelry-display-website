'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error
  resetAction: () => void  // 重命名为 resetAction
}

export default function ErrorBoundary({
  error,
  resetAction,
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={resetAction}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  )
} 