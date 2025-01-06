'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?featured=true');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-primary/5 border-primary/10">
            <div className="aspect-square bg-primary/10" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-primary/10 rounded-full w-3/4" />
              <div className="h-4 bg-primary/10 rounded-full w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-medium text-primary">Featured Products</h2>
        <Link href="/products">
          <Button 
            variant="outline" 
            className="border-accent hover:border-accent hover:bg-accent/10 text-primary"
          >
            View All Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="group overflow-hidden border-primary/10 hover:border-accent transition-all duration-500 hover:shadow-[0_8px_30px_rgb(239,182,200,0.2)] hover:-translate-y-1">
              <div className="aspect-square relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src={product.images[0] || '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/5 backdrop-blur-sm">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/80 hover:bg-white border-primary/20 text-primary hover:text-primary/80"
                  >
                    Quick View
                  </Button>
                </div>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="font-medium text-lg mb-2 text-primary group-hover:text-primary/80 transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-accent font-medium text-lg">
                    {formatPrice(product.price)}
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary/80 hover:bg-primary/5 font-medium"
                    >
                      Details →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 