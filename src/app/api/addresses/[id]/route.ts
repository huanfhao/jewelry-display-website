import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// 更新地址
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, province, city, district, address, isDefault } = body;

    // 验证必填字段
    if (!name || !phone || !province || !city || !district || !address) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 验证地址所有权
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: '地址不存在' },
        { status: 404 }
      );
    }

    // 如果设为默认地址，需要将其他地址设为非默认
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          user: {
            email: session.user.email,
          },
          NOT: {
            id: params.id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    // 更新地址
    const updatedAddress = await prisma.address.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        phone,
        province,
        city,
        district,
        address,
        isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Failed to update address:', error);
    return NextResponse.json(
      { error: '更新地址失败' },
      { status: 500 }
    );
  }
}

// 删除地址
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 验证地址所有权
    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: '地址不存在' },
        { status: 404 }
      );
    }

    // 删除地址
    await prisma.address.delete({
      where: {
        id: params.id,
      },
    });

    // 如果删除的是默认地址，将最新的地址设为默认
    if (address.isDefault) {
      const latestAddress = await prisma.address.findFirst({
        where: {
          user: {
            email: session.user.email,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (latestAddress) {
        await prisma.address.update({
          where: {
            id: latestAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json(
      { error: '删除地址失败' },
      { status: 500 }
    );
  }
} 