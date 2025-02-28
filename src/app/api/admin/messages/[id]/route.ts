import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;
    const { read } = await request.json();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 