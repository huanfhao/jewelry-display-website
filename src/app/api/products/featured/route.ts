import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        images: true,
        category: true,
        _count: {
          select: {
            inquiries: true
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
} 