import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { read } = await request.json()

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await prisma.contactMessage.delete({
      where: { id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 