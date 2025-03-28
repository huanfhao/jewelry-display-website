import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 获取单个报价详情
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
    
    // 查询报价
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        inquiry: {
          include: {
            product: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                companyName: true,
              }
            },
          },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // 检查权限：只允许管理员或相关询盘所有者查看
    if (
      session.user.role !== 'ADMIN' && 
      quotation.inquiry.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotation' },
      { status: 500 }
    );
  }
}

// 更新报价
export async function PATCH(
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
    const data = await request.json();
    
    // 查询报价
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        inquiry: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // 管理员可以更新所有字段，用户只能更新状态
    if (session.user.role === 'ADMIN') {
      // 管理员更新
      const updatedQuotation = await prisma.quotation.update({
        where: { id },
        data: {
          price: data.price,
          validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
          terms: data.terms,
          status: data.status,
        },
        include: {
          inquiry: {
            include: {
              product: {
                select: {
                  name: true,
                }
              },
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          }
        }
      });

      return NextResponse.json(updatedQuotation);
    } else if (quotation.inquiry.userId === session.user.id) {
      // 用户只能更新状态（接受/拒绝）
      if (!data.status || !['ACCEPTED', 'REJECTED'].includes(data.status)) {
        return NextResponse.json(
          { error: 'Invalid status update' },
          { status: 400 }
        );
      }

      const updatedQuotation = await prisma.quotation.update({
        where: { id },
        data: { status: data.status },
      });

      // 如果用户接受报价，更新询盘状态
      if (data.status === 'ACCEPTED') {
        await prisma.inquiry.update({
          where: { id: quotation.inquiryId },
          data: { status: 'ACCEPTED' },
        });
      } else if (data.status === 'REJECTED') {
        await prisma.inquiry.update({
          where: { id: quotation.inquiryId },
          data: { status: 'REJECTED' },
        });
      }

      return NextResponse.json(updatedQuotation);
    } else {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}

// 删除报价
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
    
    // 检查报价是否存在
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        inquiry: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // 删除报价
    await prisma.quotation.delete({
      where: { id },
    });

    // 将询盘状态重置为PENDING
    await prisma.inquiry.update({
      where: { id: quotation.inquiryId },
      data: { status: 'PENDING' },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Quotation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to delete quotation' },
      { status: 500 }
    );
  }
} 