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
        where: { id: 'ring-category' },
        update: {},
        create: {
          id: 'ring-category',
          name: 'Rings',
          description: 'Beautiful rings for every occasion',
        },
      }),
      prisma.category.upsert({
        where: { id: 'necklace-category' },
        update: {},
        create: {
          id: 'necklace-category',
          name: 'Necklaces',
          description: 'Elegant necklaces and pendants',
        },
      }),
      prisma.category.upsert({
        where: { id: 'earring-category' },
        update: {},
        create: {
          id: 'earring-category',
          name: 'Earrings',
          description: 'Stunning earrings for any style',
        },
      }),
    ]);

    // 创建示例商品
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: 'diamond-ring' },
        update: {},
        create: {
          id: 'diamond-ring',
          name: 'Diamond Ring',
          description: 'Beautiful diamond ring with 18K gold band',
          price: 999.99,
          images: [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9'
          ],
          categoryId: categories[0].id,
          stock: 10,
          isFeatured: true,
        },
      }),
      prisma.product.upsert({
        where: { id: 'pearl-necklace' },
        update: {},
        create: {
          id: 'pearl-necklace',
          name: 'Pearl Necklace',
          description: 'Elegant pearl necklace with sterling silver chain',
          price: 299.99,
          images: [
            'https://images.unsplash.com/photo-1599643477877-530eb83abc8e',
            'https://images.unsplash.com/photo-1599643478518-a5e4b12cdb42'
          ],
          categoryId: categories[1].id,
          stock: 15,
          isFeatured: true,
        },
      }),
      prisma.product.upsert({
        where: { id: 'sapphire-earrings' },
        update: {},
        create: {
          id: 'sapphire-earrings',
          name: 'Sapphire Earrings',
          description: 'Stunning sapphire earrings with diamond accents',
          price: 599.99,
          images: [
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
            'https://images.unsplash.com/photo-1602752250015-52934bc45613'
          ],
          categoryId: categories[2].id,
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
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 