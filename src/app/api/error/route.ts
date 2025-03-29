import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const errorData = await request.json()

    // 记录错误到数据库
    await prisma.$queryRaw`
      INSERT INTO error_logs (
        id,
        message,
        stack,
        component_stack,
        url,
        user_agent,
        timestamp
      ) VALUES (
        gen_random_uuid(),
        ${errorData.message || 'Unknown error'},
        ${errorData.stack},
        ${errorData.componentStack},
        ${errorData.url},
        ${errorData.userAgent},
        NOW()
      )
    `

    return NextResponse.json({ status: 'success' }, { status: 202 })
  } catch (error) {
    console.error('Error saving error log:', error)
    return NextResponse.json(
      { status: 'error', message: 'Failed to save error log' },
      { status: 500 }
    )
  }
} 