import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 获取联系表单消息
    const contactMessages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // 获取博客评论，使用 comments 而不是 comment
    const comments = await prisma.$queryRaw<any[]>`
      SELECT 
        c.*,
        b.title as post_title
      FROM comments c
      LEFT JOIN blog_posts b ON c."postId" = b.id
      ORDER BY c."createdAt" DESC
    `

    return NextResponse.json({
      contactMessages,
      comments
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
} 