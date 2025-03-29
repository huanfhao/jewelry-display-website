import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 设置为动态路由以避免缓存
export const dynamic = 'force-dynamic'

// 简单的API路由，用于唤醒数据库连接
export async function GET() {
  try {
    // 执行一个轻量级查询来预热数据库连接
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Database warmup error:', error)
    
    // 返回更详细的错误信息
    return NextResponse.json(
      { error: 'Failed to warm up database' },
      { status: 500 }
    )
  }
} 