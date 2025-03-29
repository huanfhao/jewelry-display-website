'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/products/ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('Error loading product. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link 
          href="/dashboard/products"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <ProductForm product={product} />
    </div>
  );
} 