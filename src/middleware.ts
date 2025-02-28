import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 使用内存存储请求记录
const rateLimit = new Map<string, { count: number; timestamp: number }>()

// 限流配置
const RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1小时
  max: 10 // 最大请求次数
}

export async function middleware(request: NextRequest) {
  // 只对联系表单 API 进行限流
  if (request.nextUrl.pathname === '/api/contact') {
    const ip = request.ip ?? '127.0.0.1'
    const now = Date.now()
    const windowStart = now - RATE_LIMIT.windowMs

    // 清理过期的记录
    const record = rateLimit.get(ip)
    if (!record || record.timestamp < windowStart) {
      rateLimit.set(ip, { count: 1, timestamp: now })
    } else {
      // 增加计数
      record.count++
      if (record.count > RATE_LIMIT.max) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': '3600',
          },
        })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/contact',
} 