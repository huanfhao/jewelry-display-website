import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        tags: true,
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      coverImage,
      published,
      publishedAt,
      categories,
      tags,
    } = body

    // 生成 slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published,
        publishedAt: published ? new Date(publishedAt) : null,
        categories: {
          connect: categories.map((id: string) => ({ id })),
        },
        tags: {
          connect: tags.map((id: string) => ({ id })),
        },
      },
      include: {
        categories: true,
        tags: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 