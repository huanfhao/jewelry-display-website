import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 测试数据库连接
    await prisma.$connect();
    
    // 尝试执行一个简单的查询
    const productsCount = await prisma.product.count();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      productsCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 