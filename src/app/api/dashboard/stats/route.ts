import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [products, inquiries, customers] = await Promise.all([
      prisma.product.count(),
      prisma.inquiry.count(),
      prisma.user.count({
        where: {
          role: 'USER'
        }
      })
    ]);

    return NextResponse.json({
      products,
      inquiries,
      customers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 