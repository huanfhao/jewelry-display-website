import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 获取订单
    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    // 验证订单所属用户
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权操作此订单' },
        { status: 403 }
      );
    }

    // 验证订单状态
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: '只能取消待付款的订单' },
        { status: 400 }
      );
    }

    // 开始事务处理
    const updatedOrder = await prisma.$transaction(async (prisma) => {
      // 更新订单状态
      const order = await prisma.order.update({
        where: {
          id: params.id,
        },
        data: {
          status: 'CANCELLED',
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 恢复商品库存
      for (const item of order.items) {
        await prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: '取消订单失败' },
      { status: 500 }
    );
  }
} 