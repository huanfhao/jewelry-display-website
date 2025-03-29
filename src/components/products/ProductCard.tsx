'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { generatePlaceholderColor } from '@/lib/image-utils';

interface ProductCardProps {
  title: string;
  image: string;
  description: string;
  slug: string;
  onClick: () => void;
  category?: string;
  price?: number;
  inquiryCount?: number;
}

/**
 * 处理图片URL，如果是Cloudinary URL则使用代理
 */
function getProxiedImageUrl(url: string): string {
  if (url.startsWith('https://res.cloudinary.com/')) {
    // 使用我们的代理API
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  // 其他图片URL保持不变
  return url;
}

export default function ProductCard({ 
  title, 
  image, 
  description, 
  slug, 
  onClick,
  category,
  price,
  inquiryCount = 0
}: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const placeholderColor = generatePlaceholderColor(image);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer border border-gray-100 transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50"
        style={{ backgroundColor: placeholderColor }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw"
          className={`object-contain transition-all duration-300 group-hover:scale-105 p-4
                    ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          quality={85}
          priority={false}
          onLoad={() => setIsImageLoaded(true)}
        />
        {category && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
            {category}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
            {title}
          </h3>
          {inquiryCount > 0 && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
              {inquiryCount} inquiries
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex items-center justify-between">
          {price ? (
            <span className="text-lg font-semibold text-blue-600">
              ${price.toFixed(2)}
            </span>
          ) : (
            <span className="text-sm text-gray-500">Price on request</span>
          )}
          <button 
            className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium 
                     hover:bg-blue-100 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
} 