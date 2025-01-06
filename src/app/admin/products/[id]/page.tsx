'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImagePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string | null;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
    categoryId: null,
  });

  useEffect(() => {
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    if (!isNew) {
      fetchProduct();
    }
  }, [session, router, isNew, params.id]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`);
      if (!response.ok) {
        throw new Error('获取产品信息失败');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError('加载产品信息失败');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products${isNew ? '' : `/${params.id}`}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        throw new Error(isNew ? '创建产品失败' : '更新产品失败');
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(isNew ? '创建产品失败，请重试' : '更新产品失败，请重试');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传图片失败');
      }

      const data = await response.json();
      setProduct({
        ...product,
        images: [...product.images, data.url],
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('上传图片失败，请重试');
    }
  }

  function handleRemoveImage(index: number) {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return (
      <div className="text-center py-8">加载中...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNew ? '添加产品' : '编辑产品'}
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/products')}
        >
          返回
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">产品名称</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">产品描述</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price">价格</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">库存</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label>产品图片</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {product.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={saving}
              className="w-full"
            >
              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {saving
                ? '保存中...'
                : isNew
                ? '创建产品'
                : '更新产品'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
} 