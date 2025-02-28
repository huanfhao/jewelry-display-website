import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { Order, OrderItem, User } from '@prisma/client'
import { formatPrice } from './utils'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  try {
    const data = await resend.emails.send({
      from: 'SY Jewelry <noreply@syjewelry.com>',
      to,
      subject,
      html,
    })
    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}

export const sendOrderConfirmation = async (
  email: string,
  orderNumber: string,
  items: any[],
  total: number
) => {
  const html = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order #${orderNumber}</p>
    <h2>Order Details:</h2>
    <ul>
      ${items.map(item => `
        <li>${item.name} x ${item.quantity} - $${item.price}</li>
      `).join('')}
    </ul>
    <p>Total: $${total}</p>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderNumber}`,
    html,
  })
}

interface SendOrderEmailParams {
  order: Order
  user: User
  items: (OrderItem & {
    product: {
      name: string
      price: number
    }
  })[]
}

export async function sendOrderEmail({ order, user, items }: SendOrderEmailParams) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const itemsList = items
    .map(
      item => `
      <tr>
        <td>${item.product.name}</td>
        <td>${item.quantity}</td>
        <td>${formatPrice(item.price)}</td>
        <td>${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join('')

  const html = `
    <h2>新订单通知</h2>
    <p>订单号：${order.id}</p>
    <p>客户信息：</p>
    <ul>
      <li>姓名：${user.name}</li>
      <li>邮箱：${user.email}</li>
      <li>收货人：${order.shippingName}</li>
      <li>电话：${order.shippingPhone}</li>
      <li>地址：${order.shippingAddress}</li>
      <li>备注：${order.note || '无'}</li>
    </ul>
    <h3>订单商品：</h3>
    <table border="1" cellpadding="5">
      <tr>
        <th>商品名称</th>
        <th>数量</th>
        <th>单价</th>
        <th>小计</th>
      </tr>
      ${itemsList}
      <tr>
        <td colspan="3">总计</td>
        <td>${formatPrice(order.total)}</td>
      </tr>
    </table>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `新订单通知 - ${order.id}`,
    html,
  })
} 