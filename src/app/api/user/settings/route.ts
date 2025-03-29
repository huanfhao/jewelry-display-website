import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/app/api/error'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // 更新用户设置
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        language: data.language,
        theme: data.theme,
        emailNotifications: data.emailNotifications,
        marketingEmails: data.marketingEmails,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取用户设置
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        language: true,
        theme: true,
        emailNotifications: true,
        marketingEmails: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return handleApiError(error)
  }
} 