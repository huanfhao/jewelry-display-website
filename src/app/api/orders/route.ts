import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { OrderStatus, Prisma } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 发送订单确认邮件
    const itemsList = order.items.map((item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">¥${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">¥${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    await resend.emails.send({
      from: 'SY Jewelry <onboarding@resend.dev>',
      to: email,
      subject: `订单确认 #${order.id}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">订单确认</h1>
          <p>尊敬的 ${name}：</p>
          <p>感谢您的订购！以下是您的订单详情：</p>
          
          <h2 style="color: #333;">订单信息</h2>
          <p>订单号：${order.id}</p>
          <p>下单时间：${order.createdAt.toLocaleString()}</p>
          
          <h2 style="color: #333;">商品清单</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left;">商品</th>
                <th style="padding: 10px; text-align: left;">数量</th>
                <th style="padding: 10px; text-align: left;">单价</th>
                <th style="padding: 10px; text-align: left;">小计</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div style="margin-top: 20px;">
            <p>商品总额：¥${(order.total - 10).toFixed(2)}</p>
            <p>运费：¥10.00</p>
            <p style="font-size: 18px; font-weight: bold;">实付金额：¥${order.total.toFixed(2)}</p>
          </div>
          
          <h2 style="color: #333;">收货信息</h2>
          <p>收货人：${name}</p>
          <p>电话：${phone}</p>
          <p>地址：${address}</p>
          ${note ? `<p>备注：${note}</p>` : ''}
          
          <p style="margin-top: 30px;">我们会尽快处理您的订单。如有任何问题，请随时联系我们。</p>
        </div>
      `,
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

    // 如果是 Resend 错误，返回邮件发送失败信息
    if (error?.name === 'ResendError') {
      return NextResponse.json(
        { error: '订单已创建，但邮件发送失败' },
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