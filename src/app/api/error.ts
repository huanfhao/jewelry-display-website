import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // 处理已知的 Prisma 错误
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'Unique constraint violation' },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        )
      default:
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        )
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    // 处理数据库连接错误
    return NextResponse.json(
      { error: 'Database connection error' },
      { status: 503 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
} 