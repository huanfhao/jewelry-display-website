'use client';

import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

// 配置尺寸映射
const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
  xl: 'h-16 w-16 border-4',
};

/**
 * 加载指示器组件
 */
export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClass = sizeMap[size] || sizeMap.md;
  
  return (
    <div className={`inline-block ${className}`} role="status" aria-label="加载中">
      <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClass}`}></div>
      <span className="sr-only">加载中...</span>
    </div>
  );
} 