'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/admin/products/ProductForm';

export default function NewProductPage() {
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link 
          href="/dashboard/products"
          className="inline-flex items-center"
        >
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Product</h1>
        <p className="text-gray-600">Add a new product to your catalog</p>
              </div>
              
      <ProductForm />
    </div>
  );
} 