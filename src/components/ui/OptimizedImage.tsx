'use client';

import { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { Spinner } from "@/components/ui/spinner";
import { getOptimizedImageUrl, generatePlaceholderColor, isValidImageUrl } from '@/lib/image-utils';

// 优化图片组件的属性
export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  quality?: number;
  lazyLoad?: boolean;
  containerWidthPercent?: number;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 优化图片组件
 * 提供预加载、错误处理、占位符和自动优化功能
 */
export function OptimizedImage({
  src,
  fallbackSrc = '/images/hero.jpg',
  alt,
  width,
  height,
  quality = 80,
  lazyLoad = true,
  containerWidthPercent = 100,
  className = '',
  onLoad,
  onError,
  priority = false,
  ...props
}: OptimizedImageProps) {
  // 状态
  const [isLoading, setIsLoading] = useState(!priority);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [error, setError] = useState(false);
  const [placeholderColor, setPlaceholderColor] = useState('#f0f0f0');
  const imageRef = useRef<HTMLImageElement>(null);
  
  // 处理图片URL
  useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc);
      setError(true);
      return;
    }
    
    // 重置状态
    setError(false);
    setIsLoading(!priority);
    
    // 生成占位符颜色
    setPlaceholderColor(generatePlaceholderColor(src));
    
    // 优化图片URL
    const optimizedUrl = getOptimizedImageUrl(src, { 
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
      quality 
    });
    
    setImgSrc(optimizedUrl);
  }, [src, width, height, quality, fallbackSrc, priority]);
  
  // 处理图片加载完成
  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
    onLoad?.();
  };
  
  // 处理图片加载错误
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    setImgSrc(fallbackSrc);
    onError?.();
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: placeholderColor,
        width: typeof width === 'number' ? `${width}px` : '100%',
        height: typeof height === 'number' ? `${height}px` : 'auto',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30">
          <Spinner size="md" />
        </div>
      )}
      
      {imgSrc && (
        <Image
          ref={imageRef}
          src={imgSrc}
          alt={alt || 'Image'}
          width={typeof width === 'number' ? width : 0}
          height={typeof height === 'number' ? height : 0}
          quality={quality}
          priority={priority}
          loading={priority ? 'eager' : (lazyLoad ? 'lazy' : 'eager')}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${error ? 'opacity-90' : ''} transition-opacity duration-300 w-full h-auto`}
          style={{
            objectFit: 'cover',
            opacity: isLoading ? 0 : 1,
          }}
          sizes={`${containerWidthPercent}vw`}
          {...props}
        />
      )}
    </div>
  );
} 