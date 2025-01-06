import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilter from '@/components/products/ProductFilter';
import Loading from '@/components/ui/Loading';
import { Prisma } from '@prisma/client';

export const revalidate = 3600; // 每小时重新验证一次

async function getProducts(categoryId?: string, search?: string) {
  const where: Prisma.ProductWhereInput = {
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      ],
    }),
  };

  return prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const productsPromise = getProducts(searchParams.category, searchParams.search);
  const categoriesPromise = getCategories();

  const [products, categories] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductFilter
            categories={categories}
            selectedCategory={searchParams.category}
            searchQuery={searchParams.search}
          />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            <ProductGrid products={products} />
          </Suspense>
        </main>
      </div>
    </div>
  );
} 