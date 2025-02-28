import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 获取购物车商品数量
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const count = await prisma.cartItem.count({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json({ count: 0 });
  }
} 