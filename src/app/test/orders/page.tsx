'use client';

import React from 'react'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
}

export default function TestOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [result, setResult] = useState<any>(null);

  // 获取订单列表
  async function getOrders() {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', error });
    }
  }

  // 创建测试订单
  async function createTestOrder() {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              productId: 'diamond-ring',
              quantity: 1,
            },
          ],
          shippingAddress: {
            name: 'Test User',
            phone: '1234567890',
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            country: 'Test Country',
          },
        }),
      });
      const data = await response.json();
      setResult({ type: 'success', data });
      getOrders();
    } catch (error) {
      setResult({ type: 'error', error });
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <p className="text-gray-600">
            {session ? 'Logged in' : 'Not logged in'}
          </p>
        </div>

        <div className="space-x-2">
          <button
            onClick={getOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Orders
          </button>

          <button
            onClick={createTestOrder}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Test Order
          </button>
        </div>

        {orders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border p-4 mb-4">
                  <p>Order ID: {order.id}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: {formatPrice(order.total)}</p>
                  <div>
                    <p>Items:</p>
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.product.name} x {item.quantity} @ {formatPrice(item.price)}
                      </div>
                    ))}
                  </div>
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