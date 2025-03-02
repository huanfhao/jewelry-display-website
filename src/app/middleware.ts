import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // 添加 Content-Security-Policy 头
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self' https:;
      script-src 'self' 'unsafe-inline' 'unsafe-eval' 
        https://www.googletagmanager.com 
        https://www.google-analytics.com
        https://analytics.google.com
        https://www.facebook.com
        https://store.flylinking.com
        https://td.doubleclick.net
        https://*.doubleclick.net
        https://*.google-analytics.com
        https://*.google.com
        https://*.google.com.hk
        https://*.vercel-insights.com
        https://*.vercel-analytics.com
        https://*.vercel.com
        https://*.cloudflare.com
        https://*.clarity.ms
        https://connect.facebook.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob: 
        https://www.facebook.com
        https://www.google-analytics.com
        https://www.google.com
        https://www.google.com.hk
        https://*.google-analytics.com
        https://*.google.com
        https://*.google.com.hk
        https://*.doubleclick.net
        https://*.facebook.com
        https://*.clarity.ms
        https://*.bing.com
        https://res.cloudinary.com;
      font-src 'self' https://fonts.gstatic.com data:;
      connect-src 'self' 
        https://www.google-analytics.com 
        https://analytics.google.com 
        https://vitals.vercel-insights.com
        https://*.vercel-insights.com
        https://*.vercel-analytics.com
        https://*.vercel.com
        https://www.facebook.com
        https://store.flylinking.com
        https://td.doubleclick.net
        https://www.google.com
        https://www.google.com.hk
        https://*.google-analytics.com
        https://*.google.com
        https://*.google.com.hk
        https://*.doubleclick.net
        https://*.facebook.com
        https://*.flylinking.com
        https://*.clarity.ms
        https://*.bing.com
        https://*.cloudflare.com
        wss://*.vercel.app;
      frame-src 'self' 
        https://www.facebook.com
        https://store.flylinking.com
        https://td.doubleclick.net
        https://*.doubleclick.net
        https://*.facebook.com
        https://*.flylinking.com
        https://*.clarity.ms
        https://connect.facebook.net;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      worker-src 'self' blob:;
      manifest-src 'self';
      media-src 'self' blob: data:;
      child-src 'self' blob:;
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim()
  )

  // 添加其他安全头
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
} 