import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/products/ProductForm';

export const metadata: Metadata = {
  title: 'Create New Product',
  description: 'Add a new product to your catalog',
};

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Product</h1>
      <ProductForm />
    </div>
  );
} 