import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/db-init'

// 简单的API路由，用于唤醒数据库连接
export async function GET() {
  try {
    const result = await initializeDatabase()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database warmup completed successfully' 
    })
  } catch (error) {
    console.error('Database warmup error:', error)
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    )
  }
} 