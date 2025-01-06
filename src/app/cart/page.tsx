'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { AddToCartToast } from '@/components/ui/add-to-cart-toast';
import { Input } from "@/components/ui/input";
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuantityChange(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.stock) {
      setToastMessage('Out of stock');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setUpdating(itemId);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error === 'Out of stock') {
          setToastMessage('Out of stock');
          setToastType('error');
          setShowToast(true);
        }
        return;
      }

      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(itemId: string) {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setToastMessage('Item removed');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error removing item:', error);
      setToastMessage('Failed to remove item, please try again');
      setToastType('error');
      setShowToast(true);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  async function handleCheckout() {
    if (items.length === 0) return;

    setCheckingOut(true);
    try {
      // Check stock for all items
      for (const item of items) {
        if (item.quantity > item.stock) {
          setToastMessage('Out of stock');
          setToastType('error');
          setShowToast(true);
          return;
        }
      }

      // Redirect to checkout page
      router.push('/checkout');
    } catch (error) {
      console.error('Error during checkout:', error);
      setToastMessage('Checkout failed');
      setToastType('error');
      setShowToast(true);
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-[400px] bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <Card className="p-8 text-center">
          <div className="text-red-500">{error}</div>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center h-10 px-6 font-medium text-white transition-colors bg-primary rounded-md hover:bg-primary/90"
          >
            Start Shopping
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-gray-600 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="overflow-hidden border-0 shadow-sm">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-6">
                    <Link
                      href={`/products/${item.productId}`}
                      className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-lg font-medium hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-4">
                        <p className="text-primary text-lg font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                        {item.stock <= 5 && (
                          <span className="text-sm text-orange-500">
                            Only {item.stock} left
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex items-center gap-6">
                        <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-l-lg hover:bg-gray-50"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                if (value > item.stock) {
                                  setToastMessage('Out of stock');
                                  setToastType('error');
                                  setShowToast(true);
                                  return;
                                }
                                handleQuantityChange(item.id, value);
                              }
                            }}
                            className="w-14 h-9 text-center border-0 focus:outline-none text-sm font-medium [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-r-lg hover:bg-gray-50"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updating === item.id || item.quantity >= item.stock}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2">Remove</span>
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-4 border-0 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-primary">${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Including VAT</p>
              </div>
            </div>
            <Button
              className="w-full mt-6 h-12 text-base font-medium shadow-sm"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </Button>
          </Card>
        </div>
      </div>

      <AddToCartToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
    </div>
  );
} 