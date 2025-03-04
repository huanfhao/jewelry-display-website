'use client'

import { useState } from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface ImageProps extends NextImageProps {
  wrapperClassName?: string
  seoDescription?: string
}

export default function Image({ 
  wrapperClassName, 
  className,
  alt,
  seoDescription,
  priority = false,
  ...props 
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  const imageAlt = alt || seoDescription || 'Professional jewelry display product image'

  return (
    <div 
      className={cn(
        'overflow-hidden bg-gray-100',
        isLoading && 'animate-pulse',
        wrapperClassName
      )}
      role="img"
      aria-label={imageAlt}
    >
      <NextImage
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
          className
        )}
        alt={imageAlt}
        priority={priority}
        quality={75}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  )
} 