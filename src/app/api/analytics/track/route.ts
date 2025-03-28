import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, properties } = body

    if (event === 'whatsapp_inquiry_click') {
      // 记录 WhatsApp 点击事件
      await prisma.analytics.create({
        data: {
          event,
          productName: properties.productName,
          productUrl: properties.productUrl,
          timestamp: new Date(properties.timestamp),
          type: `whatsapp_inquiry:${properties.productId}`,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to track analytics:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
} 