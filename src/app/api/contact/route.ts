import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // 验证输入
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 保存消息到数据库
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      }
    });

    // 发送邮件到管理员邮箱
    await resend.emails.send({
      from: 'SY Jewelry Display <noreply@syjewelry.com>',
      to: process.env.ADMIN_EMAIL!,
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

    return NextResponse.json({ success: true, message: contactMessage });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 