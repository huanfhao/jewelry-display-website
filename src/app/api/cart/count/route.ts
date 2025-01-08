import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 获取购物车商品数量
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ count: 0 });
    }

    // 获取购物车商品总数量
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        quantity: true,
      },
    });

    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json({ count: 0 });
  }
} 