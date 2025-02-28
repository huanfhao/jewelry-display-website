import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { WebVitalsMetric } from '@/types'

export async function POST(request: Request) {
  try {
    const metric = await request.json() as WebVitalsMetric

    // 保存性能指标
    await prisma.performanceMetric.create({
      data: {
        id: metric.id,
        name: metric.name,
        value: metric.value,
        label: metric.label ?? null,
        page: metric.page ?? null,
      }
    })

    return new NextResponse(null, { status: 202 })
  } catch (error) {
    console.error('Error saving vitals:', error)
    return new NextResponse(null, { status: 500 })
  }
} 