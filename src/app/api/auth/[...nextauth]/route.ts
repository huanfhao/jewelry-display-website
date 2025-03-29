import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth/next';

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
  adapter: PrismaAdapter(prisma),
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
            console.error('Missing credentials:', { email: !!credentials?.email, password: !!credentials?.password });
            throw new Error('Missing credentials');
          }

          // 检查是否是管理员账户
          if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
            console.log('Admin login successful');
            return {
              id: 'admin-user-id',
              email: 'admin@example.com',
              name: 'Admin',
              role: 'ADMIN',
            };
          }

          // 如果不是管理员，则检查数据库
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.error('User not found:', credentials.email);
            throw new Error('Invalid credentials');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.email);
            throw new Error('Invalid credentials');
          }

          console.log('User login successful:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0], // 使用邮箱前缀作为默认名称
            role: user.role,
          };
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST } 