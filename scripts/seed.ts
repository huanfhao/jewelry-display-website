import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // 创建管理员用户
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // 创建商品分类
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'rings' },
        update: {},
        create: {
          name: 'Rings',
          slug: 'rings',
          description: 'Ring display stands and props'
        }
      }),
      prisma.category.upsert({
        where: { slug: 'necklaces' },
        update: {},
        create: {
          name: 'Necklaces',
          slug: 'necklaces',
          description: 'Elegant necklaces and pendants',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'earrings' },
        update: {},
        create: {
          name: 'Earrings',
          slug: 'earrings',
          description: 'Stunning earrings for any style',
        },
      }),
    ]);

    // 创建示例商品
    const products = await Promise.all([
      prisma.product.upsert({
        where: { slug: 'diamond-ring' },
        update: {},
        create: {
          title: 'Diamond Ring',
          description: 'Beautiful diamond ring with 18K gold band',
          image: '/images/products/ring-display.jpg',
          price: 999.99,
          slug: 'diamond-ring',
          category: 'Rings',
          stock: 10,
          isFeatured: true,
        },
      }),
      prisma.product.upsert({
        where: { slug: 'pearl-necklace' },
        update: {},
        create: {
          title: 'Pearl Necklace',
          description: 'Elegant pearl necklace with sterling silver chain',
          image: '/images/products/necklace-display.jpg',
          price: 299.99,
          slug: 'pearl-necklace',
          category: 'Necklaces',
          stock: 15,
          isFeatured: true,
        },
      }),
      prisma.product.upsert({
        where: { slug: 'sapphire-earrings' },
        update: {},
        create: {
          title: 'Sapphire Earrings',
          description: 'Stunning sapphire earrings with diamond accents',
          image: '/images/products/earring-display.jpg',
          price: 599.99,
          slug: 'sapphire-earrings',
          category: 'Earrings',
          stock: 8,
          isFeatured: true,
        },
      }),
    ]);

    console.log('Database seeded successfully!');
    console.log('Admin user created:', admin.email);
    console.log('Categories created:', categories.length);
    console.log('Products created:', products.length);
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 