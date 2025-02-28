import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // 公开路由
      const publicPaths = [
        '/',
        '/products',
        '/categories',
        '/login',
        '/register',
        '/about',
        '/contact',
        '/custom'
      ]
      
      const path = req.nextUrl.pathname
      
      // 允许公开路由访问
      if (publicPaths.includes(path)) {
        return true
      }

      // 管理员路由检查
      if (path.startsWith('/admin')) {
        return token?.role === 'ADMIN'
      }

      // 其他路由需要登录
      return !!token
    }
  }
})

export const config = {
  matcher: [
    /*
     * 匹配所有路由除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ]
} 