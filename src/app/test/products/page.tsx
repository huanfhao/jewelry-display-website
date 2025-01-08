'use client';

import React from 'react'
import { formatPrice } from '@/lib/utils'
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
  isFeatured: boolean;
  category: {
    name: string;
  };
}

export default function TestProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [result, setResult] = useState<any>(null);

  // 获取所有分类
  async function getCategories() {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // 搜索产品
  async function searchProducts() {
    try {
      let url = '/api/products?';
      const params = new URLSearchParams();
      
      if (search) {
        params.append('search', search);
      }
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`${url}${params.toString()}`);
      const data = await response.json();
      setProducts(data);
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({ type: 'error', error });
    }
  }

  // 初始加载时获取分类
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products Test</h1>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search products..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={searchProducts}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {products.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {product.category.name}
                  </p>
                  <p className="font-medium">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Last Operation Result</h2>
            <pre className="p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 