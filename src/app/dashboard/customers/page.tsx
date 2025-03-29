import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import CustomersClient from './page.client';

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // 获取用户数据
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyName: true,
      companySize: true,
      industry: true,
      position: true,
      country: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 序列化日期
  const serializedUsers = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  const pagination = {
    total: users.length,
    page: 1,
    limit: 10,
    totalPages: Math.ceil(users.length / 10),
  };

  return (
    <div className="p-6">
      <CustomersClient
        initialUsers={serializedUsers}
        initialPagination={pagination}
      />
    </div>
  );
} 