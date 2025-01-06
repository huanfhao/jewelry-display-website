import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true }
}>;

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=暂无图片';

// 获取购物车列表
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    });

    const items = cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      image: item.product.images[0] || PLACEHOLDER_IMAGE,
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: '获取购物车失败，请重试' },
      { status: 500 }
    );
  }
}

// 添加商品到购物车
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
    const { productId, quantity } = body;

    if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: '无效的请求参数' },
        { status: 400 }
      );
    }

    // 检查商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }

    // 检查库存
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: '库存不足' },
        { status: 400 }
      );
    }

    // 检查是否已经在购物车中
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    let cartItem;
    if (existingCartItem) {
      // 更新数量
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
          updatedAt: new Date(),
        },
        include: {
          product: true,
        },
      });
    } else {
      // 创建新的购物车项
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
        },
        include: {
          product: true,
        },
      });
    }

    return NextResponse.json({
      id: cartItem.id,
      productId: cartItem.productId,
      name: cartItem.product.name,
      price: Number(cartItem.product.price),
      quantity: cartItem.quantity,
      image: cartItem.product.images[0] || PLACEHOLDER_IMAGE,
    });
  } catch (error) {
    console.error('Error in POST /api/cart:', error);
    return NextResponse.json(
      { error: '添加到购物车失败，请重试' },
      { status: 500 }
    );
  }
}