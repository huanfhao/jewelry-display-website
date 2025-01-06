'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import type { Product, Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { AddToCartToast } from '@/components/ui/add-to-cart-toast';
import { useSession } from 'next-auth/react';

type ProductWithCategory = Product & {
  category: Category;
};

interface ProductGridProps {
  products: ProductWithCategory[];
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

export default function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleAddToCart = async (product: ProductWithCategory, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent link navigation
    if (addingToCart) return; // If adding another product, do not process

    // Check if logged in
    if (!session) {
      router.push('/login');
      return;
    }

    // Check stock
    if (product.stock <= 0) {
      setToastMessage('Out of stock');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setAddingToCart(product.id);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error === 'Out of stock') {
          // Get current quantity in cart
          const cartResponse = await fetch('/api/cart');
          const cartItems = await cartResponse.json();
          const currentCartItem = cartItems.find((item: any) => item.productId === product.id);
          const currentQuantity = currentCartItem ? currentCartItem.quantity : 0;

          setToastMessage(`Out of stock. Current stock: ${product.stock}, In cart: ${currentQuantity}`);
          setToastType('error');
        } else {
          throw new Error(data.error || 'Failed to add to cart');
        }
      } else {
        setToastMessage('Added to cart');
        setToastType('success');
      }
      setShowToast(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to add to cart, please try again');
      setToastType('error');
      setShowToast(true);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg hover:border-primary/50 hover:scale-[1.02] transition-all duration-300">
            <Link href={`/products/${product.id}`} className="flex flex-col h-full group">
              <div className="relative w-full pt-[100%] bg-gray-50">
                <Image
                  src={product.images[0] || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={true}
                />
              </div>
              <div className="p-5 flex-1 flex flex-col border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {product.category.name}
                  </span>
                </div>
                {product.stock > 0 ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product.id}
                  >
                    {addingToCart === product.id ? (
                      'Adding...'
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {session ? 'Add to Cart' : 'Login to Add to Cart'}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Out of Stock
                  </Button>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-orange-500 text-sm mt-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                    Only {product.stock} left in stock!
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No products available
          </div>
        )}
      </div>
      <AddToCartToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
} 