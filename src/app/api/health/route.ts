import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 使用更基础的健康检查
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ 
      status: 'ok',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 