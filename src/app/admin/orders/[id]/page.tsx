'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string | null;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
}

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      setError('Error loading order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!order) return;

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <button
          onClick={() => window.location.href = '/admin/orders'}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back to Orders
        </button>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Order ID</h2>
              <p className="mt-1">{order.id}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Date</h2>
              <p className="mt-1">
                {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Amount</h2>
              <p className="mt-1">${order.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-sm font-medium text-gray-500">Customer</h2>
            <div className="mt-1">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-gray-500">{order.user.email}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-sm font-medium text-gray-500">Shipping Information</h2>
            <div className="mt-1 space-y-2">
              <p><span className="font-medium">Name:</span> {order.shippingName}</p>
              <p><span className="font-medium">Phone:</span> {order.shippingPhone}</p>
              <p><span className="font-medium">Address:</span> {order.shippingAddress}</p>
              {order.note && (
                <p><span className="font-medium">Note:</span> {order.note}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Order Items</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 