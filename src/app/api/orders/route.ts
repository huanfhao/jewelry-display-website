import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus, Prisma } from '@prisma/client';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, email, address, note } = body;

    // 验证必填字段
    if (!name || !phone || !email || !address) {
      return NextResponse.json(
        { error: '请填写完整的收货信息' },
        { status: 400 }
      );
    }

    // 获取用户的购物车
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: '购物车为空' },
        { status: 400 }
      );
    }

    // 检查库存
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          { error: `商品 ${item.product.name} 库存不足` },
          { status: 400 }
        );
      }
    }

    // 计算总金额
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    // 创建订单
    const orderData = {
      userId: session.user.id,
      total: total + 10, // 加上运费
      status: OrderStatus.PENDING,
      shippingName: name as string,
      shippingPhone: phone as string,
      shippingAddress: address as string,
      note: note || null,
      items: {
        create: cartItems.map((item) => ({
          quantity: item.quantity,
          price: Number(item.product.price),
          productId: item.productId,
        })),
      },
    } satisfies Prisma.OrderUncheckedCreateInput;

    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }) as OrderWithItems;

    // 更新商品库存
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 清空购物车
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creating order:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
    });

    // 如果是 Prisma 错误，返回更具体的错误信息
    if (error?.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json(
        { error: '数据库操作失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '创建订单失败，请重试' },
      { status: 500 }
    );
  }
}

// GET /api/orders - 获取用户订单列表
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: '获取订单列表失败' },
      { status: 500 }
    );
  }
} 