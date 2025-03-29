'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  isFeatured: boolean;
  createdAt: string;
  _count: {
    inquiries: number;
    orderItems: number;
  };
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted successfully');
      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Featured
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inquiries
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  {product.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.category || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.isFeatured ? 'Yes' : 'No'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product._count.inquiries}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product._count.orderItems}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDistanceToNow(new Date(product.createdAt), {
                  addSuffix: true,
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting === product.id}
                  className="text-red-600 hover:text-red-900"
                >
                  {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 