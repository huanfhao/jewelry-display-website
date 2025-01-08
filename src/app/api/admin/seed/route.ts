import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // 创建分类
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Rings',
          description: 'Elegant rings for every occasion',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Necklaces',
          description: 'Beautiful necklaces and pendants',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Earrings',
          description: 'Stunning earrings collection',
        },
      }),
    ]);

    // 创建产品
    const products = await Promise.all([
      // 戒指
      prisma.product.create({
        data: {
          name: 'Diamond Solitaire Ring',
          description: 'Classic diamond solitaire ring in 18k white gold',
          price: 2999.99,
          images: ['/images/placeholder.jpg'],
          stock: 10,
          isFeatured: true,
          categoryId: categories[0].id,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Sapphire Eternity Band',
          description: 'Beautiful sapphire eternity band in platinum',
          price: 1999.99,
          images: ['/images/placeholder.jpg'],
          stock: 15,
          isFeatured: true,
          categoryId: categories[0].id,
        },
      }),
      // 项链
      prisma.product.create({
        data: {
          name: 'Pearl Pendant Necklace',
          description: 'Elegant pearl pendant necklace in 18k yellow gold',
          price: 1499.99,
          images: ['/images/placeholder.jpg'],
          stock: 20,
          isFeatured: true,
          categoryId: categories[1].id,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Diamond Tennis Necklace',
          description: 'Stunning diamond tennis necklace in platinum',
          price: 4999.99,
          images: ['/images/placeholder.jpg'],
          stock: 5,
          isFeatured: false,
          categoryId: categories[1].id,
        },
      }),
      // 耳环
      prisma.product.create({
        data: {
          name: 'Diamond Stud Earrings',
          description: 'Classic diamond stud earrings in 18k white gold',
          price: 1299.99,
          images: ['/images/placeholder.jpg'],
          stock: 25,
          isFeatured: true,
          categoryId: categories[2].id,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Pearl Drop Earrings',
          description: 'Elegant pearl drop earrings in 18k yellow gold',
          price: 899.99,
          images: ['/images/placeholder.jpg'],
          stock: 30,
          isFeatured: false,
          categoryId: categories[2].id,
        },
      }),
    ]);

    return NextResponse.json({ categories, products });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
} 