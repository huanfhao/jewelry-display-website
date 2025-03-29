'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  isFeatured: boolean;
  images: string[];
  sampleAvailable: boolean;
  samplePrice: number | null;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also delete all product images.')) {
      return;
    }
    
    setDeletingId(id);
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred while deleting the product');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage and organize your product catalog</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filter Products</CardTitle>
          <CardDescription>Search and filter products by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center border rounded-md px-3 py-2 flex-1">
              <Search className="w-4 h-4 mr-2 text-muted-foreground" />
              <input
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <select className="border rounded-md px-3 py-2">
              <option value="">All Categories</option>
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="bracelets">Bracelets</option>
              <option value="earrings">Earrings</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 relative rounded overflow-hidden">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">SKU: {product.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isFeatured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sampleAvailable ? (
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Available
                        </span>
                        {product.samplePrice && (
                          <div className="text-sm text-gray-500 mt-1">
                            ${product.samplePrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Not Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 