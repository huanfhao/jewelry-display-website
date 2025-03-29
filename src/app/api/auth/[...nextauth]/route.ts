import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authDebugOptions } from '@/lib/auth-debug';

const prisma = new PrismaClient();

// 扩展 Session 类型
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    }
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

// 扩展 JWT 类型
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing credentials');
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            console.error('User not found');
            return null;
          }

          // 在实际应用中，这里应该使用 bcrypt 比较密码
          // 这里临时使用简单比较，后续会改进
          if (user.password === credentials.password) {
            return {
              id: user.id,
              email: user.email,
              name: user.name || 'User',
              role: user.role || 'USER',
            };
          }

          console.error('Invalid password');
          return null;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          // 当用户首次登录时，将用户信息添加到 token
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.role = user.role;
        }
        // 确保返回完整的 token
        return {
          ...token,
          id: token.id || 'default-id',
          email: token.email || 'default@example.com',
          name: token.name || 'Default User',
          role: token.role || 'USER',
        };
      } catch (error) {
        console.error('JWT callback error:', error);
        // 返回带有默认值的 token
        return {
          ...token,
          id: 'default-id',
          email: 'default@example.com',
          name: 'Default User',
          role: 'USER',
        };
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          // 确保 session.user 包含所有必要的字段
          session.user = {
            id: token.id || 'default-id',
            email: token.email || 'default@example.com',
            name: token.name || 'Default User',
            role: token.role || 'USER',
          };
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        // 返回带有默认值的 session
        return {
          ...session,
          user: {
            id: 'default-id',
            email: 'default@example.com',
            name: 'Default User',
            role: 'USER',
          },
        };
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

// 使用调试版本的认证选项
const handler = NextAuth(authDebugOptions);
export { handler as GET, handler as POST }; 