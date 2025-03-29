import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shouldRefresh = url.searchParams.get('refresh') === 'true';

    // 获取所有联系消息
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // 获取所有评论
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          select: {
            title: true
          }
        }
      }
    });

    // 序列化日期
    const serializedMessages = messages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt.toISOString(),
      updatedAt: msg.updatedAt.toISOString()
    }));

    const serializedComments = comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    }));

    return NextResponse.json({
      messages: serializedMessages,
      comments: serializedComments
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', message: (error as Error).message },
      { status: 500 }
    );
  }
} 