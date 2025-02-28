'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, ShoppingBag, Tag } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, router]);

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return null;
  }

  const quickLinks = [
    {
      title: 'Order Management',
      description: 'View and process all orders',
      href: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      title: 'Product Management',
      description: 'Manage product information and inventory',
      href: '/admin/products',
      icon: Package,
    },
    {
      title: 'Category Management',
      description: 'Manage product categories',
      href: '/admin/categories',
      icon: Tag,
    },
  ];

  // 获取未读消息数量
  const unreadCount = await prisma.contactMessage.count({
    where: { read: false }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.href} className="p-6 hover:shadow-lg transition-shadow">
              <Link href={link.href} className="block">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{link.title}</h2>
                    <p className="text-sm text-gray-500">{link.description}</p>
                  </div>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Quick Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-primary">-</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Sales</p>
              <p className="text-2xl font-bold text-primary">$0.00</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock Alert</p>
              <p className="text-2xl font-bold text-primary">-</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Unread Messages</h3>
          <p className="text-3xl font-bold text-primary">{unreadCount}</p>
        </div>
      </div>
    </div>
  );
} 