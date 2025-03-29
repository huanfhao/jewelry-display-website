import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/products/ProductForm';

export const metadata: Metadata = {
  title: 'Edit Product',
  description: 'Edit product details',
};

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    redirect('/admin/products');
  }

  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const product = await getProduct(params.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
} 