import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"
import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module "next-auth" {
  interface User {
    id: string
    role: string
    name?: string | null
    email: string
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}

declare module "*.module.css" {
  const classes: { [key: string]: string }
  export default classes
}

declare module "*.module.scss" {
  const classes: { [key: string]: string }
  export default classes
}

// 确保 TypeScript 识别这是一个模块
export {} 