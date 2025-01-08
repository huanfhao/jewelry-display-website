import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilter from '@/components/products/ProductFilter';
import Pagination from '@/components/ui/Pagination';
import Loading from '@/components/ui/Loading';
import { Prisma } from '@prisma/client';
import{ unstable_cache } from 'next/cache';

export const revalidate = 60; // 每分钟重新验证一次

const ITEMS_PER_PAGE = 12;
const DEFAULT_IMAGE = '/images/placeholder.jpg';

const getCachedProducts = unstable_cache(
 async (categoryId?: string, search?: string, page: number = 1) => {
    const where: Prisma.ProductWhereInput = {
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }),
    };

    const skip = (page - 1) * ITEMS_PER_PAGE;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.product.count({ where }),
    ]);

    const validatedProducts = products.map(product => ({
      ...product,
      images: product.images.filter((url: string) => {
        if (!url) return false;
        try {
          new URL(url);
          return true;
        } catch {
          console.warn(`Invalid image URL found in product ${product.id}:`, url);
          return false;
        }
      })
    }));

    const productsWithImages = validatedProducts.map(product=> ({
      ...product,
      images: product.images.length > 0 ? product.images : [DEFAULT_IMAGE],
    }));

    return {
      products: productsWithImages,
      total,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    };
  },
  ['products'],
  {
    revalidate: 60, // 缓存1分钟
    tags: ['products']
  }
);

const getCachedCategories = unstable_cache(
 async () => {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },
  ['categories'],
  {
    revalidate: 300, // 缓存5分钟
    tags: ['categories']
  }
);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  
  const [{ products, total, totalPages }, categories] = await Promise.all([
    getCachedProducts(searchParams.category, searchParams.search, currentPage),
    getCachedCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-24 mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64">
          <div className="sticky top-24">
            <ProductFilter
              categories={categories}
              selectedCategory={searchParams.category}
              searchQuery={searchParams.search}
            />
          </div>
        </aside>

        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            <ProductGrid products={products} />
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/products?${new URLSearchParams({
                    ...(searchParams.category && { category: searchParams.category }),
                    ...(searchParams.search && { search: searchParams.search }),
                  }).toString()}`}
                />
              </div>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
} 