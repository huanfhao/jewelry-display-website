import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '无权访问' },
        { status: 403 }
      );
    }

    const [
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true
        }
      })
    ]);

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
} 