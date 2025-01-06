'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
}

const orderStatusMap = {
  PENDING: { label: '待付款', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '已确认', color: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: '已发货', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: '已送达', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '已取消', color: 'bg-red-100 text-red-800' },
};

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [session, router]);

  async function fetchOrders() {
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('获取订单失败');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError('加载订单失败');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(orderId: string, status: Order['status']) {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('更新订单状态失败');
      }

      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('更新订单状态失败，请重试');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">加载中...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">订单编号</p>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-gray-500 mt-1">
                  下单时间：{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}
                </p>
                <p className="text-sm mt-2">
                  <span className="text-gray-500">客户：</span>
                  {order.user.name} ({order.user.email})
                </p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatusMap[order.status].color}`}>
                  {orderStatusMap[order.status].label}
                </span>
                {order.status === 'PENDING' && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('确定要将订单标记为已确认吗？')) {
                          handleUpdateStatus(order.id, 'CONFIRMED');
                        }
                      }}
                    >
                      标记为已确认
                    </Button>
                  </div>
                )}
                {order.status === 'CONFIRMED' && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('确定要将订单标记为已发货吗？')) {
                          handleUpdateStatus(order.id, 'SHIPPED');
                        }
                      }}
                    >
                      标记为已发货
                    </Button>
                  </div>
                )}
                {order.status === 'SHIPPED' && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('确定要将订单标记为已送达吗？')) {
                          handleUpdateStatus(order.id, 'DELIVERED');
                        }
                      }}
                    >
                      标记为已送达
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
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
                      数量：{item.quantity}
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

            <div className="mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">收货信息</p>
                <p className="text-sm">{order.shippingName} {order.shippingPhone}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress}</p>
                {order.note && (
                  <p className="text-sm text-gray-500 mt-2">
                    备注：{order.note}
                  </p>
                )}
              </div>
              <div className="text-right mt-4">
                <p className="text-sm text-gray-500">订单总额</p>
                <p className="text-lg font-bold text-primary">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 