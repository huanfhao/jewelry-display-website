const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // 创建管理员用户
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin',
        password: adminPassword,
        role: 'ADMIN'
      }
    })

    // 创建商品分类
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'display-solutions' },
        update: {},
        create: {
          name: 'Display Solutions',
          slug: 'display-solutions',
          description: 'Professional display solutions for jewelry stores'
        }
      }),
      prisma.category.upsert({
        where: { slug: 'tips-guides' },
        update: {},
        create: {
          name: 'Tips & Guides',
          slug: 'tips-guides',
          description: 'Helpful guides and tips for jewelry display'
        }
      })
    ])

    // 创建示例博客文章
    await prisma.blogPost.upsert({
      where: { slug: 'how-to-choose-jewelry-displays' },
      update: {},
      create: {
        title: '如何选择合适的珠宝展示道具',
        slug: 'how-to-choose-jewelry-displays',
        content: '选择合适的珠宝展示道具对于珠宝店来说至关重要...',
        excerpt: '了解如何为您的珠宝店选择最合适的展示道具',
        published: true,
        publishedAt: new Date()
      }
    })

    console.log('Database seeded successfully!')
    console.log('Admin user created:', admin.email)
    console.log('Categories created:', categories.length)
  } catch (error) {
    console.error('Seeding error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 