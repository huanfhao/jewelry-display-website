import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

    // 获取订单详情
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
        user: {
          select: {
            name: true,
            email: true,
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
        { error: '只能发送待付款的订单' },
        { status: 400 }
      );
    }

    // 生成订单详情HTML
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.product.name}</td>
        <td>${item.quantity}</td>
        <td>¥${item.price.toFixed(2)}</td>
        <td>¥${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // 发送邮件
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `新订单通知 - 订单号：${order.id}`,
      html: `
        <h2>新订单通知</h2>
        <p>订单号：${order.id}</p>
        <p>客户：${order.user.name} (${order.user.email})</p>
        <p>收货人：${order.shippingName}</p>
        <p>联系电话：${order.shippingPhone}</p>
        <p>收货地址：${order.shippingAddress}</p>
        ${order.note ? `<p>订单备注：${order.note}</p>` : ''}
        
        <h3>订单商品</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>商品名称</th>
            <th>数量</th>
            <th>单价</th>
            <th>小计</th>
          </tr>
          ${itemsHtml}
          <tr>
            <td colspan="3" align="right"><strong>总计：</strong></td>
            <td><strong>¥${order.total.toFixed(2)}</strong></td>
          </tr>
        </table>
      `,
    });

    // 更新订单状态为已确认
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status: 'CONFIRMED',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error sending order notification:', error);
    return NextResponse.json(
      { error: '发送订单通知失败' },
      { status: 500 }
    );
  }
} 