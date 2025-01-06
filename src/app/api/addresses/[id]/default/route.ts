import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 先将所有地址设为非默认
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

    // 将选中的地址设为默认
    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        isDefault: true,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Failed to set default address:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 