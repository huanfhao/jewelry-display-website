import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n/config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 检查路径是否已经有语言前缀
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // 从请求中获取语言
  const locale = request.headers.get('accept-language')?.split(',')[0] || i18n.defaultLocale

  // 重定向到带有语言前缀的路径
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    // 跳过所有内部路径 (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
} 