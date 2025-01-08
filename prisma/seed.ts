const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // 创建管理员用户
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // 创建商品分类
  const ringCategory = await prisma.category.upsert({
    where: { id: 'ring-category' },
    update: {},
    create: {
      id: 'ring-category',
      name: 'Rings',
      description: 'Beautiful rings for every occasion',
    },
  })

  const earringCategory = await prisma.category.upsert({
    where: { id: 'earring-category' },
    update: {},
    create: {
      id: 'earring-category',
      name: 'Earrings',
      description: 'Elegant earrings for any style',
    },
  })

  const necklaceCategory = await prisma.category.upsert({
    where: { id: 'necklace-category' },
    update: {},
    create: {
      id: 'necklace-category',
      name: 'Necklaces',
      description: 'Stunning necklaces for every occasion',
    },
  })

  // 创建商品
  const diamondRing = await prisma.product.upsert({
    where: { id: 'diamond-ring' },
    update: {},
    create: {
      id: 'diamond-ring',
      name: 'Diamond Ring',
      description: 'Beautiful diamond ring with 18K gold band',
      price: 999.99,
      images: [
        '/images/products/ring1.jpg',
        '/images/products/ring2.jpg'
      ],
      categoryId: ringCategory.id,
      stock: 10,
      isFeatured: true,
    },
  })

  const sapphireEarrings = await prisma.product.upsert({
    where: { id: 'sapphire-earrings' },
    update: {},
    create: {
      id: 'sapphire-earrings',
      name: 'Sapphire Earrings',
      description: 'Stunning sapphire earrings with diamond accents',
      price: 599.99,
      images: [
        '/images/products/earring1.jpg',
        '/images/products/earring2.jpg'
      ],
      categoryId: earringCategory.id,
      stock: 8,
      isFeatured: true,
    },
  })

  const pearlNecklace = await prisma.product.upsert({
    where: { id: 'pearl-necklace' },
    update: {},
    create: {
      id: 'pearl-necklace',
      name: 'Pearl Necklace',
      description: 'Elegant pearl necklace with sterling silver chain',
      price: 299.99,
      images: [
        '/images/products/necklace1.jpg',
        '/images/products/necklace2.jpg'
      ],
      categoryId: necklaceCategory.id,
      stock: 15,
      isFeatured: true,
    },
  })

  console.log({ admin, ringCategory, earringCategory, necklaceCategory, diamondRing, sapphireEarrings, pearlNecklace })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 