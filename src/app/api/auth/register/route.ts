import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      email,
      password,
      companyName,
      companySize,
      industry,
      position,
      address,
      country,
    } = data;

    // 检查邮箱是否已被注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await hash(password, 12);

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: companyName,
        role: 'USER',
      },
    });

    // 移除密码后返回用户信息
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed, please try again' },
      { status: 500 }
    );
  }
} 