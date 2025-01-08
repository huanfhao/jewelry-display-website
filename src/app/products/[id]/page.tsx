import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import ProductDetails from '@/components/products/ProductDetails';

interface ProductPageProps {
  params: {
    id: string;
  };
}

const DEFAULT_IMAGE = '/images/placeholder.jpg';

// 使用 unstable_cache 缓存产品数据
const getCachedProduct = unstable_cache(
  async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return null;
    }

    // 验证图片 URLs
    const validatedImages = product.images.filter(url => {
      if (!url) return false;
      try {
        new URL(url);
        return true;
      } catch {
        console.warn(`Invalid image URL found in product ${product.id}:`, url);
        return false;
      }
    });

    return {
      ...product,
      images: validatedImages.length > 0 ? validatedImages : [DEFAULT_IMAGE],
    };
  },
  ['product'],
  {
    revalidate: 60, // 缓存1分钟
    tags: ['product']
  }
);

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getCachedProduct(params.id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
} 