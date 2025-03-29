import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// 定义输入验证架构
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long')
});

// 检查必要的环境变量
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// 初始化Resend客户端（如果API密钥存在）
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 使用Zod验证输入
    try {
      contactSchema.parse({ name, email, message });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Validation failed', details: (validationError as z.ZodError).format() },
        { status: 400 }
      );
    }

    // 保存消息到数据库（即使邮件发送失败也会保存）
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        read: false
      }
    });

    // 如果没有配置邮件服务，记录警告但仍然继续
    if (!resend || !ADMIN_EMAIL) {
      console.warn('Email sending skipped: Missing RESEND_API_KEY or ADMIN_EMAIL');
    } else {
      try {
        // 发送邮件到管理员邮箱
        await resend.emails.send({
          from: 'SY Jewelry Display <noreply@syjewelry.com>',
          to: ADMIN_EMAIL,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });

        // 发送确认邮件给用户
        await resend.emails.send({
          from: 'SY Jewelry Display <noreply@syjewelry.com>',
          to: email,
          subject: 'Thank you for contacting SY Jewelry Display',
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,</p>
            <p>SY Jewelry Display Team</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // 邮件发送失败但消息已保存到数据库，返回部分成功状态
        return NextResponse.json(
          { 
            message: 'Message saved but email notification failed', 
            data: newMessage 
          },
          { status: 207 } // 使用207 Multi-Status表示部分成功
        );
      }
    }

    return NextResponse.json({ 
      message: 'Message received successfully', 
      data: newMessage 
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: 'Failed to process contact request', message: (error as Error).message },
      { status: 500 }
    );
  }
} 