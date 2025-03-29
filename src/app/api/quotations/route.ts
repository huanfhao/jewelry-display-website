import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 创建新报价
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { inquiryId, price, validUntil, terms } = data;

    // 检查询盘是否存在
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: { quotation: true },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    let quotation;

    // 如果已存在报价，则更新
    if (inquiry.quotation) {
      quotation = await prisma.quotation.update({
        where: { inquiryId },
        data: {
          price,
          validUntil: new Date(validUntil),
          terms,
          status: 'PENDING',
        },
      });
    } else {
      // 创建新报价
      quotation = await prisma.quotation.create({
        data: {
          inquiryId,
          price,
          validUntil: new Date(validUntil),
          terms,
          status: 'PENDING',
        },
      });

      // 更新询盘状态为已报价
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: 'QUOTED' },
      });
    }

    return NextResponse.json({
      success: true,
      quotation,
    });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}

// 获取所有报价（仅管理员可用）
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

    // 获取总数
    const total = await prisma.quotation.count({ where });

    // 获取分页数据
    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        inquiry: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      quotations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
} 