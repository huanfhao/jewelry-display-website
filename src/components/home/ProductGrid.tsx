'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group flex flex-col h-full"
        >
          <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="aspect-[4/3] relative w-full">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {product.title}
              </h3>
              <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                {product.description}
              </p>
              {product.price && (
                <p className="text-primary font-medium mt-auto">
                  ${Number(product.price).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 