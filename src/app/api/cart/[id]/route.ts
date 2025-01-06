import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 更新购物车项数量
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: '无效的数量' },
        { status: 400 }
      );
    }

    // 获取购物车项和对应的商品信息
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: { product: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: '购物车项不存在' },
        { status: 404 }
      );
    }

    // 验证是否是当前用户的购物车项
    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权操作此购物车项' },
        { status: 403 }
      );
    }

    // 检查库存
    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        { error: '库存不足' },
        { status: 400 }
      );
    }

    // 更新数量
    const updatedItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({
      id: updatedItem.id,
      productId: updatedItem.productId,
      name: updatedItem.product.name,
      price: Number(updatedItem.product.price),
      quantity: updatedItem.quantity,
      image: updatedItem.product.images[0] || 'https://via.placeholder.com/400x400?text=暂无图片',
      stock: updatedItem.product.stock,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: '更新购物车失败' },
      { status: 500 }
    );
  }
}

// 删除购物车项
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: '购物车项不存在' },
        { status: 404 }
      );
    }

    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权操作此购物车项' },
        { status: 403 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: '删除购物车项失败' },
      { status: 500 }
    );
  }
} 