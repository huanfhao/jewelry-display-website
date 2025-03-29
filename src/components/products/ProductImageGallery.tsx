'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePreloader } from '@/components/ui/ImagePreloader';
import { getOptimizedImageUrl, generatePlaceholderColor } from '@/lib/image-utils';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Record<number, boolean>>({});
  const [placeholderColor, setPlaceholderColor] = useState('#f0f0f0');
  const isMounted = useRef(true);

  // 确保images非空
  const validImages = images && images.length > 0 ? images : ['/images/hero.jpg'];
  
  // 组件挂载/卸载控制
  useEffect(() => {
    isMounted.current = true;
    // 为当前图片生成占位符颜色
    if (validImages[currentIndex]) {
      setPlaceholderColor(generatePlaceholderColor(validImages[currentIndex]));
    }
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // 当前图片变化时更新占位符颜色
  useEffect(() => {
    if (validImages[currentIndex]) {
      setPlaceholderColor(generatePlaceholderColor(validImages[currentIndex]));
    }
  }, [currentIndex, validImages]);

  // 图片加载处理
  const handleImageLoad = (index: number) => {
    if (isMounted.current) {
      setPreloadedImages(prev => ({ ...prev, [index]: true }));
      
      // 当当前图片加载完成时，更新加载状态
      if (index === currentIndex) {
        setIsLoading(false);
      }
    }
  };
  
  // 主图像加载完成处理
  const handleMainImageLoad = () => {
    setIsLoading(false);
  };

  // 下一张图片
  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
    );
    // 如果下一张图片没有预加载，则设置加载状态
    if (!preloadedImages[(currentIndex + 1) % validImages.length]) {
      setIsLoading(true);
    }
  };

  // 上一张图片
  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
    );
    // 如果上一张图片没有预加载，则设置加载状态
    if (!preloadedImages[(currentIndex - 1 + validImages.length) % validImages.length]) {
      setIsLoading(true);
    }
  };

  // 选择特定图片
  const selectImage = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      // 如果选择的图片没有预加载，则设置加载状态
      if (!preloadedImages[index]) {
        setIsLoading(true);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 预加载所有图片 */}
      <ImagePreloader 
        imageUrls={validImages}
        onImageLoad={(url, index) => handleImageLoad(index)}
        startOnMount={true}
        showIndicator={false}
        quality={80}
      />

      {/* 主图片显示区域 */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted"
           style={{ backgroundColor: placeholderColor }}>
        <Image
          src={validImages[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          width={800}
          height={800}
          priority={currentIndex === 0}
          quality={90}
          className="h-full w-full object-cover"
          onLoad={handleMainImageLoad}
        />
        
        {/* 导航按钮（仅当有多张图片时显示） */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* 缩略图预览区域（仅当有多张图片时显示） */}
      {validImages.length > 1 && (
        <div className="w-full">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mt-4">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`relative aspect-square overflow-hidden rounded-md transition-all duration-200
                          ${index === currentIndex 
                            ? 'ring-2 ring-blue-600 ring-offset-2' 
                            : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 20vw, (max-width: 768px) 16.67vw, (max-width: 1024px) 12.5vw, 10vw"
                  className={`object-cover transition-opacity duration-200
                            ${index === currentIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                  quality={60}
                  priority={index < 8}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 