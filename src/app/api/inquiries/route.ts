import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 构建过滤条件
    const where = {
      ...(status && { status }),
    };

    // 获取匹配条件的总数
    const total = await prisma.inquiry.count({ where });

    // 获取分页数据
    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
        quotation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// 创建新的询盘（供非管理员用户使用）
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { productId, quantity, message, name, email, company } = data;

    // 查找产品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // 创建询盘
    const inquiry = await prisma.inquiry.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
        message,
      },
      include: {
        product: true,
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
} 