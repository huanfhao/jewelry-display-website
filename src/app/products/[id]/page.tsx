'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { AddToCartToast } from '@/components/ui/add-to-cart-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
}

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError('Failed to load product');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  }

  async function handleAddToCart() {
    if (!product) return;
    setAdding(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      setShowToast(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart, please try again');
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-[600px] bg-primary/5 rounded-2xl mb-8" />
          <div className="h-8 bg-primary/5 rounded-full w-1/2 mb-4" />
          <div className="h-4 bg-primary/5 rounded-full w-1/4 mb-8" />
          <div className="h-24 bg-primary/5 rounded-2xl mb-8" />
          <div className="h-12 bg-primary/5 rounded-full w-48" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 bg-primary/5 border-primary/10">
          <div className="text-center text-primary/70">{error || 'Product not found'}</div>
          <Button
            variant="outline"
            className="mt-6 border-accent hover:border-accent hover:bg-accent/10 text-primary"
            onClick={() => router.push('/products')}
          >
            Back to Products
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8 bg-primary/5 border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image
                src={product.images[selectedImage] || '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-accent' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif font-medium text-primary mb-4">{product.name}</h1>
              <p className="text-2xl font-medium text-accent mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-primary/70 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="border-primary/20 hover:border-primary/40 text-primary"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium text-primary w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="border-primary/20 hover:border-primary/40 text-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-primary/60">
                  Stock: {product.stock}
                </span>
              </div>

              <Button
                className="w-full bg-accent hover:bg-accent/90 text-primary font-medium"
                size="lg"
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
              >
                {adding ? (
                  'Adding to Cart...'
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-primary/10 space-y-4">
              <h3 className="text-lg font-medium text-primary/90">Product Details</h3>
              <ul className="space-y-2 text-primary/70">
                <li>• Free shipping on orders over $100</li>
                <li>• 30-day return policy</li>
                <li>• Certificate of authenticity included</li>
                <li>• Gift wrapping available</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <AddToCartToast
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
} 