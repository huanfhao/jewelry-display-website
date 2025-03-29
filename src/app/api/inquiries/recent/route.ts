import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        product: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    const formattedInquiries = inquiries.map(inquiry => ({
      id: inquiry.id,
      productName: inquiry.product.name,
      customerName: inquiry.user.name,
      status: inquiry.status,
      createdAt: inquiry.createdAt.toISOString()
    }));

    return NextResponse.json(formattedInquiries);
  } catch (error) {
    console.error('Error fetching recent inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent inquiries' },
      { status: 500 }
    );
  }
} 