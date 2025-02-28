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
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { productId, quantity } = await request.json()

    // 检查商品是否存在及库存
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: '库存不足' },
        { status: 400 }
      )
    }

    // 更新或创建购物车项
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      },
      update: {
        quantity: {
          increment: quantity
        }
      },
      create: {
        userId: session.user.id,
        productId,
        quantity
      }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: '添加到购物车失败' },
      { status: 500 }
    )
  }
}