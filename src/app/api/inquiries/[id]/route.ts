import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 获取单个询盘详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // 查询详细信息
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            industry: true,
            position: true,
            address: true,
            country: true,
            createdAt: true,
          }
        },
        quotation: true,
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // 检查权限：只允许管理员或询盘所有者查看
    if (session.user.role !== 'ADMIN' && inquiry.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// 更新询盘状态
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();
    
    // 确保询盘存在
    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // 更新询盘状态
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status: data.status,
      },
      include: {
        product: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        },
      },
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// 删除询盘
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // 检查询盘是否存在
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        quotation: true,
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // 如果有报价，先删除报价
    if (inquiry.quotation) {
      await prisma.quotation.delete({
        where: { inquiryId: id },
      });
    }

    // 删除询盘
    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Inquiry deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
} 