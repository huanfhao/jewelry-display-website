import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建默认管理员账户
  const adminPassword = await hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN'
    },
  })

  // 创建基础产品分类
  const categories = [
    { id: 'necklace', name: '项链', slug: 'necklace', description: '精美项链系列' },
    { id: 'ring', name: '戒指', slug: 'ring', description: '奢华戒指系列' },
    { id: 'bracelet', name: '手链', slug: 'bracelet', description: '时尚手链系列' },
    { id: 'earring', name: '耳饰', slug: 'earring', description: '优雅耳饰系列' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    })
  }

  // 在现有的 seed.ts 中修改商品数据
  const products = [
    {
      name: '钻石项链',
      description: '精美钻石项链，18K金链条',
      price: 9999.99,
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a'
      ],
      categoryId: 'necklace',
      stock: 10,
      isFeatured: true
    },
    {
      name: '蓝宝石戒指',
      description: '奢华蓝宝石戒指，白金镶嵌',
      price: 8888.99,
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9'
      ],
      categoryId: 'ring',
      stock: 5,
      isFeatured: true
    },
    {
      name: '珍珠手链',
      description: '天然珍珠手链，925银扣',
      price: 3999.99,
      images: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401',
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638'
      ],
      categoryId: 'bracelet',
      stock: 15,
      isFeatured: false
    },
    {
      name: '钻石耳环',
      description: '优雅钻石耳环，18K玫瑰金',
      price: 6999.99,
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
        'https://images.unsplash.com/photo-1598560917505-59a3ad559071'
      ],
      categoryId: 'earring',
      stock: 8,
      isFeatured: true
    }
  ]

  // 修改商品创建逻辑
  for (const product of products) {
    const productId = `${product.categoryId}-${product.name.toLowerCase().replace(/\s+/g, '-')}`
    await prisma.product.upsert({
      where: { id: productId },
      update: product,
      create: {
        id: productId,
        ...product
      },
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 