import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { moderateComment } from '@/lib/commentModeration'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { author, email, content, postId } = body

    // 评论审核
    const moderationResult = moderateComment(content);
    if (!moderationResult.isValid) {
      return NextResponse.json(
        { error: moderationResult.reason },
        { status: 400 }
      );
    }

    const comment = await prisma.$queryRaw<any>`
      INSERT INTO comments (id, author, email, content, "postId", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${author},
        ${email},
        ${content},
        ${postId},
        NOW(),
        NOW()
      )
      RETURNING id, author, content, "createdAt"
    `

    return NextResponse.json(comment[0])
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
} 