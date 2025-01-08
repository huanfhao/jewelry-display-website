import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 获取购物车商品
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    });

    // 转换为前端需要的格式
    const formattedItems = cartItems.map(item => ({
      id: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      stock: item.product.stock,
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new NextResponse('Error fetching cart items', { status: 500 });
  }
}

// 更新购物车商品数量
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { productId, quantity } = await req.json();

    // 验证商品库存
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    if (quantity > product.stock) {
      return new NextResponse('Not enough stock', { status: 400 });
    }

    // 更新购物车商品数量
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (!cartItem) {
      return new NextResponse('Cart item not found', { status: 404 });
    }

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
    });

    return new NextResponse('Cart item updated', { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return new NextResponse('Error updating cart item', { status: 500 });
  }
}

// 删除购物车商品
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { productId } = await req.json();

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (!cartItem) {
      return new NextResponse('Cart item not found', { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return new NextResponse('Cart item deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return new NextResponse('Error deleting cart item', { status: 500 });
  }
}

// 添加商品到购物车
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { productId, quantity } = await req.json();

    // 验证商品库存
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    if (quantity > product.stock) {
      return new NextResponse('Not enough stock', { status: 400 });
    }

    // 检查商品是否已在购物车中
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingItem) {
      // 如果商品已存在，更新数量
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return new NextResponse('Not enough stock', { status: 400 });
      }

      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      // 如果商品不存在，创建新的购物车项
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
        },
      });
    }

    return new NextResponse('Cart item added', { status: 200 });
  } catch (error) {
    console.error('Error adding cart item:', error);
    return new NextResponse('Error adding cart item', { status: 500 });
  }
}