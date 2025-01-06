'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string | null;
  items: OrderItem[];
}

const orderStatusMap = {
  PENDING: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    fetchOrder();
  }, [session, router, params.id]);

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

  async function handleCancel() {
    if (!order || order.status !== 'PENDING') return;
    
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order, please try again');
    }
  }

  async function handlePay() {
    if (!order || order.status !== 'PENDING') return;

    try {
      const response = await fetch(`/api/orders/${order.id}/notify`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      alert('Order submitted successfully! We will process your order as soon as possible!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order, please try again');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">Loading...</div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-red-500 text-center py-8">
        {error || 'Order not found'}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Link
          href="/account/orders"
          className="text-primary hover:underline"
        >
          Back to Orders
        </Link>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
              <p className="text-sm text-gray-500 mt-1">
                Order Date: {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatusMap[order.status].color}`}>
              {orderStatusMap[order.status].label}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <img
                    src={item.product.images[0] || '/images/placeholder.jpg'}
                    alt={item.product.name}
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-2">
            <p>
              <span className="text-gray-500">Recipient: </span>
              {order.shippingName}
            </p>
            <p>
              <span className="text-gray-500">Phone: </span>
              {order.shippingPhone}
            </p>
            <p>
              <span className="text-gray-500">Address: </span>
              {order.shippingAddress}
            </p>
            {order.note && (
              <p>
                <span className="text-gray-500">Order Notes: </span>
                {order.note}
              </p>
            )}
          </div>
        </div>
      </Card>

      {order.status === 'PENDING' && (
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel Order
          </Button>
          <Button onClick={handlePay}>
            Submit Order
          </Button>
        </div>
      )}
    </div>
  );
} 