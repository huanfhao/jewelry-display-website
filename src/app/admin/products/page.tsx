import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ProductList from '@/components/admin/products/ProductList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Product Management',
  description: 'Manage your products',
};

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: true,
      isFeatured: true,
      createdAt: true,
      _count: {
        select: {
          inquiries: true,
          orderItems: true,
        },
      },
    },
  });

  return products;
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const products = await getProducts();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <a
          href="/admin/products/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Product
        </a>
      </div>
      <ProductList products={products} />
    </div>
  );
} 