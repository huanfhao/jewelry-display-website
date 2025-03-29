import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample blog posts
  const posts = [
    {
      title: '珠宝设计的艺术：从概念到创作',
      slug: 'jewelry-design-art-from-concept-to-creation',
      content: '珠宝设计是一门将艺术创意与精湛工艺完美结合的学科。本文将深入探讨珠宝设计的整个过程，从最初的灵感构思到最终的作品呈现。我们将分享专业设计师的经验，以及如何在设计中平衡美学与实用性。',
      excerpt: '探索珠宝设计的艺术过程，从创意构思到最终作品的完整指南。',
      coverImage: '/images/blog/jewelry-design.jpg',
      published: true,
      publishedAt: new Date('2024-03-01'),
    },
    {
      title: '可持续珠宝：环保材料的未来趋势',
      slug: 'sustainable-jewelry-future-trends-in-eco-friendly-materials',
      content: '随着环保意识的提升，可持续珠宝设计正成为行业的重要趋势。本文探讨了环保材料在珠宝制作中的应用，以及如何在保持产品品质的同时减少环境影响。',
      excerpt: '探索可持续珠宝设计的新趋势，了解环保材料在现代珠宝制作中的应用。',
      coverImage: '/images/blog/sustainable-jewelry.jpg',
      published: true,
      publishedAt: new Date('2024-03-15'),
    },
  ]

  for (const post of posts) {
    await prisma.blogPost.create({
      data: post,
    })
  }

  console.log('Blog posts seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })