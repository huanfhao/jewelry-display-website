import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

interface RelatedProductsProps {
  products: (Product & {
    _count: {
      inquiries: number;
    };
  })[];
  currentProductId: string;
}

/**
 * 处理图片URL，如果是Cloudinary URL则使用代理
 */
function getProxiedImageUrl(url: string): string {
  if (url && url.startsWith('https://res.cloudinary.com/')) {
    // 使用我们的代理API
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  // 其他图片URL保持不变
  return url;
}

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // 过滤掉当前产品
  const filteredProducts = products.filter(product => product.id !== currentProductId);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={product.images && product.images.length > 0 ? getProxiedImageUrl(product.images[0]) : '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-medium">{formatPrice(product.price)}</span>
                  <span className="text-sm text-muted-foreground">
                    {product._count.inquiries} inquiries
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 