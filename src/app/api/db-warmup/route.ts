import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 简单的API路由，用于唤醒数据库连接
export async function GET() {
  try {
    // 执行一个非常轻量的查询，只是为了唤醒数据库
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'Database connection active' });
  } catch (error) {
    console.error('Error warming up database:', error);
    return NextResponse.json(
      { error: 'Failed to warm up database connection' },
      { status: 500 }
    );
  }
} 