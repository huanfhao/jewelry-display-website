'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImagePreloader } from '@/components/ui/ImagePreloader';
import { generatePlaceholderColor } from '@/lib/image-utils';

interface Product {
  id: string;
  name: string;
  images: string[];
  description: string;
  slug: string;
  price: number;
  category: {
    name: string;
  };
  _count: {
    inquiries: number;
  };
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Record<string, boolean>>({});
  const [placeholderColors, setPlaceholderColors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data);
        
        // 为每个产品生成占位符颜色
        const colors: Record<string, string> = {};
        data.forEach((product: Product) => {
          if (product.images?.[0]) {
            colors[product.id] = generatePlaceholderColor(product.images[0]);
          }
        });
        setPlaceholderColors(colors);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const handleImageLoad = (productId: string) => {
    setPreloadedImages(prev => ({ ...prev, [productId]: true }));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
      {/* 预加载所有产品图片 */}
      <ImagePreloader
        imageUrls={products.map(p => p.images?.[0]).filter(Boolean)}
        onImageLoad={(url) => {
          const product = products.find(p => p.images?.[0] === url);
          if (product) {
            handleImageLoad(product.id);
          }
        }}
        startOnMount={true}
        showIndicator={false}
        quality={85}
      />

      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => handleProductClick(product.slug)}
          className="cursor-pointer group"
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] border border-gray-100">
            <div 
              className="relative aspect-square overflow-hidden bg-gray-50"
              style={{ backgroundColor: placeholderColors[product.id] || '#f0f0f0' }}
            >
              <Image
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw"
                className={`object-contain transition-all duration-300 group-hover:scale-105 p-4
                          ${preloadedImages[product.id] ? 'opacity-100' : 'opacity-0'}`}
                quality={85}
                priority={false}
                onLoad={() => handleImageLoad(product.id)}
              />
              {product.category && (
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
                  {product.category.name}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                  {product.name}
                </h3>
                {product._count?.inquiries > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                    {product._count.inquiries} inquiries
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                {product.price ? (
                  <span className="text-lg font-semibold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Price on request</span>
                )}
                <button 
                  className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium 
                           hover:bg-blue-100 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product.slug);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 