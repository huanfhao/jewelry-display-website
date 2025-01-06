import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// 获取地址列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return NextResponse.json(
      { error: '获取地址失败' },
      { status: 500 }
    );
  }
}

// 创建新地址
export async function POST(request: Request) {
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

    // 如果设为默认地址，需要将其他地址设为非默认
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    // 创建新地址
    const newAddress = await prisma.address.create({
      data: {
        name,
        phone,
        province,
        city,
        district,
        address,
        isDefault,
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error('Failed to create address:', error);
    return NextResponse.json(
      { error: '创建地址失败' },
      { status: 500 }
    );
  }
} 