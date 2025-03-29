import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

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
        role: 'ADMIN',
      },
    })

    // 创建商品分类
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'jewelry-boxes' },
        update: {},
        create: {
          name: 'Jewelry Boxes',
          slug: 'jewelry-boxes',
          description: 'Premium quality jewelry boxes for storage and display'
        }
      }),
      prisma.category.upsert({
        where: { slug: 'jewelry-display-stands' },
        update: {},
        create: {
          name: 'Jewelry Display Stands',
          slug: 'jewelry-display-stands',
          description: 'Professional display stands for jewelry presentation',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'jewelry-display-props' },
        update: {},
        create: {
          name: 'Jewelry Display Props',
          slug: 'jewelry-display-props',
          description: 'Creative display props for jewelry presentation',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'jewelry-display-trays' },
        update: {},
        create: {
          name: 'Jewelry Display Trays',
          slug: 'jewelry-display-trays',
          description: 'Organized display trays for jewelry presentation',
        },
      }),
    ])

    // 创建示例商品
    const products = await Promise.all([
      prisma.product.upsert({
        where: { slug: 'premium-jewelry-box' },
        update: {},
        create: {
          name: 'Premium Jewelry Box',
          description: 'Luxurious jewelry box with velvet lining and multiple compartments',
          images: ['/images/products/jewelry-box.jpg'],
          price: 49.99,
          slug: 'premium-jewelry-box',
          category: 'jewelry-boxes',
          stock: 50,
          isFeatured: true,
          minOrderQuantity: 10,
          customizable: true,
          leadTime: '7-14 days',
          material: 'Wood and Velvet',
          certification: ['CE', 'RoHS'],
          origin: 'China',
          packagingInfo: 'Gift box packaging',
          tradeTerms: ['FOB', 'CIF'],
          sampleAvailable: true,
          samplePrice: 29.99
        },
      }),
      prisma.product.upsert({
        where: { slug: 'acrylic-ring-stand' },
        update: {},
        create: {
          name: 'Acrylic Ring Display Stand',
          description: 'Modern acrylic stand for displaying rings',
          images: ['/images/products/ring-stand.jpg'],
          price: 29.99,
          slug: 'acrylic-ring-stand',
          category: 'jewelry-display-stands',
          stock: 100,
          isFeatured: true,
          minOrderQuantity: 20,
          customizable: true,
          leadTime: '5-7 days',
          material: 'Acrylic',
          certification: ['CE'],
          origin: 'China',
          packagingInfo: 'Bubble wrap packaging',
          tradeTerms: ['FOB'],
          sampleAvailable: true,
          samplePrice: 19.99
        },
      }),
      prisma.product.upsert({
        where: { slug: 'necklace-bust' },
        update: {},
        create: {
          name: 'Necklace Display Bust',
          description: 'Elegant bust form for displaying necklaces',
          images: ['/images/products/necklace-bust.jpg'],
          price: 39.99,
          slug: 'necklace-bust',
          category: 'jewelry-display-props',
          stock: 75,
          isFeatured: true,
          minOrderQuantity: 15,
          customizable: true,
          leadTime: '7-10 days',
          material: 'Resin',
          certification: ['CE'],
          origin: 'China',
          packagingInfo: 'Foam packaging',
          tradeTerms: ['FOB'],
          sampleAvailable: true,
          samplePrice: 24.99
        },
      }),
      prisma.product.upsert({
        where: { slug: 'jewelry-tray' },
        update: {},
        create: {
          name: 'Jewelry Display Tray',
          description: 'Organized tray with compartments for jewelry display',
          images: ['/images/products/jewelry-tray.jpg'],
          price: 34.99,
          slug: 'jewelry-tray',
          category: 'jewelry-display-trays',
          stock: 80,
          isFeatured: true,
          minOrderQuantity: 15,
          customizable: true,
          leadTime: '5-7 days',
          material: 'Acrylic and Felt',
          certification: ['CE'],
          origin: 'China',
          packagingInfo: 'Bubble wrap packaging',
          tradeTerms: ['FOB'],
          sampleAvailable: true,
          samplePrice: 19.99
        },
      }),
    ])

    // 创建博客分类
    const blogCategories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'jewelry-trends' },
        update: {},
        create: {
          name: 'Jewelry Trends',
          slug: 'jewelry-trends',
          description: 'Latest trends in jewelry display and presentation',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'display-tips' },
        update: {},
        create: {
          name: 'Display Tips',
          slug: 'display-tips',
          description: 'Professional tips for jewelry display and presentation',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'industry-news' },
        update: {},
        create: {
          name: 'Industry News',
          slug: 'industry-news',
          description: 'Latest news and updates from the jewelry industry',
        },
      }),
    ])

    // 创建博客标签
    const blogTags = await Promise.all([
      prisma.tag.upsert({
        where: { slug: 'jewelry-boxes' },
        update: {},
        create: {
          name: 'Jewelry Boxes',
          slug: 'jewelry-boxes',
        },
      }),
      prisma.tag.upsert({
        where: { slug: 'display-stands' },
        update: {},
        create: {
          name: 'Display Stands',
          slug: 'display-stands',
        },
      }),
      prisma.tag.upsert({
        where: { slug: 'display-props' },
        update: {},
        create: {
          name: 'Display Props',
          slug: 'display-props',
        },
      }),
      prisma.tag.upsert({
        where: { slug: 'display-trays' },
        update: {},
        create: {
          name: 'Display Trays',
          slug: 'display-trays',
        },
      }),
    ])

    // 创建示例博客文章
    const blogPosts = await Promise.all([
      prisma.blogPost.upsert({
        where: { slug: 'jewelry-display-trends-2024' },
        update: {},
        create: {
          title: 'Jewelry Display Trends 2024',
          slug: 'jewelry-display-trends-2024',
          content: 'Discover the latest trends in jewelry display and presentation for 2024. From minimalist designs to sustainable materials, learn how to showcase your jewelry collection effectively.',
          excerpt: 'Explore the top jewelry display trends that will dominate the market in 2024.',
          coverImage: '/images/blog/jewelry-trends.jpg',
          published: true,
          publishedAt: new Date('2024-03-01'),
          categories: {
            connect: [
              { id: blogCategories[0].id }, // Jewelry Trends
              { id: blogCategories[1].id }, // Display Tips
            ],
          },
          tags: {
            connect: [
              { id: blogTags[0].id }, // Jewelry Boxes
              { id: blogTags[1].id }, // Display Stands
            ],
          },
        },
      }),
      prisma.blogPost.upsert({
        where: { slug: 'sustainable-jewelry-display' },
        update: {},
        create: {
          title: 'Sustainable Jewelry Display Solutions',
          slug: 'sustainable-jewelry-display',
          content: 'Learn about eco-friendly materials and sustainable practices in jewelry display. Discover how to reduce your environmental impact while maintaining beautiful presentations.',
          excerpt: 'Explore sustainable options for jewelry display and presentation.',
          coverImage: '/images/blog/sustainable-display.jpg',
          published: true,
          publishedAt: new Date('2024-03-15'),
          categories: {
            connect: [
              { id: blogCategories[0].id }, // Jewelry Trends
              { id: blogCategories[2].id }, // Industry News
            ],
          },
          tags: {
            connect: [
              { id: blogTags[2].id }, // Display Props
              { id: blogTags[3].id }, // Display Trays
            ],
          },
        },
      }),
    ])

    console.log('Database seeded successfully!')
    console.log('Admin user created:', admin.email)
    console.log('Categories created:', categories.length)
    console.log('Products created:', products.length)
    console.log('Blog categories created:', blogCategories.length)
    console.log('Blog tags created:', blogTags.length)
    console.log('Blog posts created:', blogPosts.length)
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
  .finally(async () => {
    await prisma.$disconnect()
  })