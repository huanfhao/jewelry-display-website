import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { uploadImage } from '@/lib/cloudinary'
import { handleApiError } from '@/app/api/error'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      )
    }

    // 将文件转换为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // 上传到 Cloudinary
    const result = await uploadImage(buffer, 'documents')

    // 保存文档记录
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        name: file.name,
        type: file.type,
        size: file.size,
        url: result.secure_url,
        status: 'pending'
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    return handleApiError(error)
  }
} 