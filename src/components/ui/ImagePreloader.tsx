'use client';

import { useEffect, useRef, useState } from 'react';
import { getOptimizedImageUrl } from '@/lib/image-utils';

interface ImagePreloaderProps {
  /**
   * 需要预加载的图片URL数组
   */
  imageUrls: string[];
  
  /**
   * 预加载完成后的回调
   */
  onComplete?: () => void;
  
  /**
   * 单个图片加载完成的回调
   */
  onImageLoad?: (url: string, index: number) => void;
  
  /**
   * 设置预加载图片的质量
   */
  quality?: number;
  
  /**
   * 是否在组件挂载时立即开始预加载
   */
  startOnMount?: boolean;
  
  /**
   * 是否显示加载指示器
   */
  showIndicator?: boolean;
  
  /**
   * 渲染自定义加载指示器
   */
  renderIndicator?: (loadedCount: number, totalCount: number) => React.ReactNode;
}

/**
 * 预加载图片组件
 * 允许在页面显示前预加载一组图片，以提升用户体验
 */
export function ImagePreloader({
  imageUrls,
  onComplete,
  onImageLoad,
  quality = 80,
  startOnMount = true,
  showIndicator = false,
  renderIndicator
}: ImagePreloaderProps) {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadedCount = loadedImages.length;
  const totalCount = imageUrls.length;
  const preloadedRef = useRef<{ [key: string]: boolean }>({});
  
  // 预加载单个图片
  const preloadImage = (url: string, index: number): Promise<void> => {
    // 已预加载的图片不再重复加载
    if (preloadedRef.current[url]) {
      return Promise.resolve();
    }
    
    return new Promise((resolve) => {
      const optimizedUrl = getOptimizedImageUrl(url, { quality });
      const img = new Image();
      
      img.onload = () => {
        // 标记为已加载
        preloadedRef.current[url] = true;
        setLoadedImages(prev => [...prev, url]);
        onImageLoad?.(url, index);
        resolve();
      };
      
      img.onerror = () => {
        // 即使加载失败也算完成
        resolve();
      };
      
      img.src = optimizedUrl;
    });
  };
  
  // 开始预加载所有图片
  const startPreloading = async () => {
    if (isLoading || !imageUrls.length) return;
    
    setIsLoading(true);
    setLoadedImages([]);
    
    // 使用Promise.all并行预加载所有图片
    await Promise.all(
      imageUrls.map((url, index) => preloadImage(url, index))
    );
    
    setIsLoading(false);
    onComplete?.();
  };
  
  // 在组件挂载时开始预加载
  useEffect(() => {
    if (startOnMount) {
      startPreloading();
    }
    
    // 清理函数
    return () => {
      preloadedRef.current = {};
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrls.join(',')]);
  
  // 进度计算
  const progress = totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0;
  
  // 渲染加载指示器
  if (!showIndicator) {
    return null;
  }
  
  // 自定义加载指示器或默认指示器
  return (
    <div className="image-preloader">
      {renderIndicator ? (
        renderIndicator(loadedCount, totalCount)
      ) : (
        <div className="fixed bottom-4 right-4 bg-white shadow-md rounded-md p-3 z-50">
          <div className="text-xs font-medium">{`加载图片: ${loadedCount}/${totalCount}`}</div>
          <div className="w-32 h-1 bg-gray-200 rounded-full mt-1">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 