import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function handleApiError(error: unknown) {
  console.error('API Error:', error)

  // 记录错误到数据库
  try {
    await prisma.errorLog.create({
      data: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }
    })
  } catch (logError) {
    console.error('Failed to log error:', logError)
  }

  // 返回适当的错误响应
  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    if (error.message.includes('unauthorized') || error.message.includes('unauthenticated')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (error.message.includes('forbidden')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
  }

  // 默认返回 500 错误
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
} 