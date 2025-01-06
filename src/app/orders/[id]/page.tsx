'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
}

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  async function fetchOrder() {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      setError('Failed to load order');
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center text-red-500">{error || 'Order not found'}</div>
          <Button
            onClick={() => router.push('/orders')}
            className="mt-4"
          >
            Back to Orders
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        
        <Card className="mb-6 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">Order ID: {order.id}</div>
              <div className="text-primary font-medium">
                {order.status === 'PENDING' && 'Pending'}
                {order.status === 'PAID' && 'Paid'}
                {order.status === 'SHIPPED' && 'Shipped'}
                {order.status === 'DELIVERED' && 'Delivered'}
                {order.status === 'CANCELLED' && 'Cancelled'}
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Order Date: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-6 p-6">
          <h2 className="font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-2 text-sm">
            <p>Recipient: {order.shippingName}</p>
            <p>Phone: {order.shippingPhone}</p>
            <p>Address: {order.shippingAddress}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${(order.total - 10).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="text-lg text-primary">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 