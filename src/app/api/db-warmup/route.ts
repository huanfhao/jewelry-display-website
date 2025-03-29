import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 设置为动态路由以避免缓存
export const dynamic = 'force-dynamic'

// 简单的API路由，用于唤醒数据库连接
export async function GET() {
  try {
    // 使用最基本的查询来检查数据库连接
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database warmup error:', error)
    
    // 返回更详细的错误信息
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    // 确保关闭连接
    await prisma.$disconnect()
  }
} 