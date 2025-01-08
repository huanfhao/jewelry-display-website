'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TestPage() {
  const { data: session, status } = useSession();

  const testPages = [
    {
      name: 'Register',
      path: '/test/register',
      description: '测试用户注册功能',
    },
    {
      name: 'Login',
      path: '/test/login',
      description: '测试用户登录功能',
    },
    {
      name: 'Session',
      path: '/test/session',
      description: '查看当前会话状态',
    },
    {
      name: 'Products',
      path: '/test/products',
      description: '测试产品搜索和过滤功能',
    },
    {
      name: 'Cart',
      path: '/test/cart',
      description: '测试购物车功能',
    },
    {
      name: 'Orders',
      path: '/test/orders',
      description: '测试订单功能',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Pages</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Session Status</h2>
        <p className="text-gray-600">
          Status: {status}
          {session && ` (${session.user?.email})`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testPages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium mb-2">{page.name}</h3>
            <p className="text-sm text-gray-600">{page.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">测试流程</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>访问 Session 页面确认未登录状态</li>
          <li>访问 Register 页面注册新用户</li>
          <li>访问 Login 页面登录</li>
          <li>再次访问 Session 页面确认登录状态</li>
          <li>访问 Products 页面测试产品搜索和过滤</li>
          <li>访问 Cart 页面测试购物车功能</li>
          <li>访问 Orders 页面测试订单功能</li>
        </ol>
      </div>
    </div>
  );
} 