'use client';

import React from 'react'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatPrice } from '@/lib/utils'

export default function TestCartPage() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  async function getCart() {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartItems(data);
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', error });
    }
  }

  async function addToCart(productId: string) {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });
      const data = await response.json();
      setResult({ type: 'success', data });
      getCart();
    } catch (error) {
      setResult({ type: 'error', error });
    }
  }

  async function removeFromCart(cartItemId: string) {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setResult({ type: 'success', data });
      getCart();
    } catch (error) {
      setResult({ type: 'error', error });
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cart Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <p className="text-gray-600">
            {session ? 'Logged in' : 'Not logged in'}
          </p>
        </div>

        <div className="space-x-2">
          <button
            onClick={getCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Cart
          </button>

          <button
            onClick={() => addToCart('diamond-ring')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Diamond Ring
          </button>
        </div>

        {cartItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Cart Items</h2>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Last Operation Result</h2>
            <pre className="p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 