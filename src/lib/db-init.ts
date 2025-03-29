import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function initializeDatabase() {
  try {
    // 检查是否已存在管理员用户
    const adminExists = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@example.com' },
          { role: 'ADMIN' }
        ]
      }
    })

    if (!adminExists) {
      console.log('Creating admin user...')
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
      console.log('Admin user created successfully')
    } else {
      console.log('Admin user already exists')
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
    ]

    for (const category of categoriesData) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      })
    }

    return { success: true, message: 'Database initialized successfully' }
  } catch (error) {
    console.error('Database initialization error:', error)
    return { success: false, message: String(error) }
  }
} 