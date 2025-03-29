import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth/next';

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
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = user.role;
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          session.user.role = token.role as string;
          session.user.id = token.id as string;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        throw error;
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST } 