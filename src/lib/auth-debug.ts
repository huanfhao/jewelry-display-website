import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import prisma from "@/lib/prisma";

// 扩展 Session 类型
declare module "next-auth" {
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
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

export const authDebugOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            console.error(`User not found: ${credentials.email}`);
            return null;
          }

          // DEBUG: 打印认证信息
          console.log(`Login attempt: ${credentials.email}`);
          console.log(`Input password: ${credentials.password}`);
          console.log(`DB password: ${user.password}`);
          
          // 临时使用简单比较，允许任何密码登录以进行测试
          // 安全警告：仅用于调试！生产环境必须移除
          return {
            id: user.id,
            email: user.email,
            name: user.name || "User",
            role: user.role || "USER",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
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
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          // 确保 session.user 包含所有必要的字段
          session.user = {
            id: token.id as string,
            email: token.email as string,
            name: token.name as string,
            role: token.role as string,
          };
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  debug: true,
  // 不依赖于 NEXTAUTH_URL 环境变量
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true
      }
    }
  }
};
