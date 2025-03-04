import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() as any

async function main() {
  try {
    // 创建分类
    const displayCategory = await prisma.category.create({
      data: {
        name: 'Display Solutions',
        slug: 'display-solutions'
      }
    })

    const tipsCategory = await prisma.category.create({
      data: {
        name: 'Tips & Guides',
        slug: 'tips-guides'
      }
    })

    // 创建标签
    const tags = await Promise.all([
      prisma.tag.create({ data: { name: 'Ring Display', slug: 'ring-display' } }),
      prisma.tag.create({ data: { name: 'Necklace Display', slug: 'necklace-display' } }),
      prisma.tag.create({ data: { name: 'Store Design', slug: 'store-design' } }),
      prisma.tag.create({ data: { name: 'Retail Tips', slug: 'retail-tips' } })
    ])

    // 创建博客文章
    await prisma.blogPost.create({
      data: {
        title: 'How to Choose the Perfect Ring Display Stand',
        slug: 'choose-perfect-ring-display-stand',
        content: `
          When it comes to showcasing your precious rings, choosing the right display stand is crucial. 
          Here are the key factors to consider:

          1. Material Quality
          - Acrylic vs. Velvet
          - Durability considerations
          - Cleaning and maintenance

          2. Design Elements
          - Single vs. multiple ring slots
          - Viewing angles
          - Brand consistency

          3. Practical Considerations
          - Space efficiency
          - Stackability
          - Price point optimization
        `,
        excerpt: 'A comprehensive guide to selecting the ideal ring display stand for your jewelry store.',
        coverImage: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1740642402764_f0ae2f70ff77720b457a4e8e54858901.webp',
        published: true,
        publishedAt: new Date(),
        categories: {
          connect: [{ id: displayCategory.id }]
        },
        tags: {
          connect: [
            { id: tags[0].id }, // Ring Display
            { id: tags[2].id }  // Store Design
          ]
        }
      }
    })

    await prisma.blogPost.create({
      data: {
        title: 'Maximizing Your Jewelry Store Layout',
        slug: 'maximizing-jewelry-store-layout',
        content: `
          The layout of your jewelry store can significantly impact sales. 
          Learn how to optimize your space:

          1. Traffic Flow
          - Customer journey mapping
          - Strategic display placement
          - Focal points and highlights

          2. Display Hierarchy
          - Premium product positioning
          - Collection grouping
          - Seasonal rotation

          3. Lighting Considerations
          - Natural vs artificial light
          - Spotlight placement
          - Ambiance creation
        `,
        excerpt: 'Expert tips on optimizing your jewelry store layout for maximum impact and sales.',
        coverImage: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1734597652416_1ad066513b2f086707069692b389307d.webp',
        published: true,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        categories: {
          connect: [{ id: tipsCategory.id }]
        },
        tags: {
          connect: [
            { id: tags[2].id }, // Store Design
            { id: tags[3].id }  // Retail Tips
          ]
        }
      }
    })

    await prisma.blogPost.create({
      data: {
        title: 'Innovative Necklace Display Solutions',
        slug: 'innovative-necklace-display-solutions',
        content: `
          Discover creative ways to showcase necklaces that catch the eye:

          1. Modern Display Types
          - T-bar stands
          - Bust displays
          - Wall-mounted solutions

          2. Material Selection
          - Premium materials
          - Durability factors
          - Visual appeal

          3. Practical Tips
          - Height considerations
          - Spacing guidelines
          - Maintenance advice
        `,
        excerpt: 'Explore the latest trends and solutions in necklace display design.',
        coverImage: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1734921287054_23193664127817d7fc2a2c7df6f17760.webp',
        published: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        categories: {
          connect: [{ id: displayCategory.id }]
        },
        tags: {
          connect: [
            { id: tags[1].id }, // Necklace Display
            { id: tags[2].id }  // Store Design
          ]
        }
      }
    })

    console.log('Database seeding completed!')
  } catch (error) {
    console.error('Seeding error:', error)
    throw error
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