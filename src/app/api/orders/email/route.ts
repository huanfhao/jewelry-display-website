import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { formatPrice } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { email, orderDetails } = await req.json()
    
    // 获取购物车商品
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    })

    if (!cartItems.length) {
      return new NextResponse('Cart is empty', { status: 400 })
    }

    // 创建订单邮件内容
    const itemsList = cartItems.map(item => `
      - ${item.product.name}
      Quantity: ${item.quantity}
      Price per item: ${formatPrice(item.product.price)}
      Subtotal: ${formatPrice(item.product.price * item.quantity)}
    `).join('\n')

    const emailContent = `
      Dear ${session.user.name || 'Customer'},

      Thank you for your order. Here are your order details:

      Items:
      ${itemsList}

      Order Summary:
      Subtotal: ${formatPrice(orderDetails.subtotal)}
      Shipping: ${orderDetails.shipping === 0 ? 'Free' : formatPrice(orderDetails.shipping)}
      Total: ${formatPrice(orderDetails.total)}

      Our team will contact you shortly to process your order.

      Best regards,
      SY Jewelry Display Team
    `

    // 发送邮件
    await resend.emails.send({
      from: 'SY Jewelry Display <orders@syjewelry.com>',
      to: email,
      subject: 'Your Order Details - SY Jewelry Display',
      text: emailContent,
    })

    // 清空购物车
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    return new NextResponse('Order email sent successfully', { status: 200 })
  } catch (error) {
    console.error('Error processing order:', error)
    return new NextResponse('Error processing order', { status: 500 })
  }
} 