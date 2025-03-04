import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// 使用内存存储请求记录
const rateLimit = new Map<string, { count: number; timestamp: number }>()

// 限流配置
const RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1小时
  max: 10 // 最大请求次数
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // 检查是否访问管理员页面
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // 检查 Cookie 同意
  const cookieConsent = request.cookies.get('cookie-consent')

  // 如果用户拒绝了 Cookie，阻止分析脚本加载
  if (cookieConsent?.value === 'false') {
    const response = NextResponse.next()
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    )
    return response
  }

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

  const response = NextResponse.next()

  // 添加安全相关的响应头
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:;"
  )

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 