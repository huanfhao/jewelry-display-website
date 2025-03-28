import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// 简单的API路由，用于唤醒数据库连接
export async function GET() {
  try {
    // 检查是否已存在管理员用户
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminExists) {
      // 创建管理员用户
      const adminPassword = await hash('admin123', 12)
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin',
          password: adminPassword,
          role: 'ADMIN',
        },
      })
    }

    // 检查并创建基本分类
    const categoriesData = [
      {
        name: 'Jewelry Boxes',
        slug: 'jewelry-boxes',
        description: 'Premium quality jewelry boxes for storage and display'
      },
      {
        name: 'Jewelry Display Stands',
        slug: 'jewelry-display-stands',
        description: 'Professional display stands for jewelry presentation',
      },
      // 添加其他基础分类...
    ]

    for (const category of categoriesData) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database warmup completed successfully' 
    })
  } catch (error) {
    console.error('Database warmup error:', error)
    return NextResponse.json(
      { success: false, message: 'Database warmup failed' },
      { status: 500 }
    )
  }
} 