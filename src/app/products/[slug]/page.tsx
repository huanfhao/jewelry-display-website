import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ProductDetails } from '@/components/products/ProductDetails'
import { ProductInquiryForm } from '@/components/products/ProductInquiryForm'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Plane } from 'lucide-react'
import { SampleOrderButton } from '@/components/ui/SampleOrderButton'
import { formatPrice } from '@/lib/utils'

interface Props {
  params: {
    slug: string;
  };
}

/**
 * 处理图片URL，如果是Cloudinary URL则使用代理
 */
function getProxiedImageUrl(url: string): string {
  if (url.startsWith('https://res.cloudinary.com/')) {
    // 使用我们的代理API
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  // 其他图片URL保持不变
  return url;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          inquiries: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}

async function getRelatedProducts(category: string | null, currentSlug: string) {
  if (!category) return [];

  return prisma.product.findMany({
    where: {
      category,
      slug: {
        not: currentSlug,
      },
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          inquiries: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  const relatedProducts = await getRelatedProducts(product.category, params.slug);

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {/* 左侧列 - 只包含产品图片画廊 */}
        <div className="md:h-[calc(100vh-100px)] md:sticky md:top-0">
          <ProductImageGallery 
            images={product.images || []} 
            productName={product.name}
          />
        </div>

        {/* 右侧：产品详情和样品信息 */}
        <div className="space-y-8">
          {/* 产品详情 */}
          <ProductDetails product={product} />
          
          {/* 样品信息 - 移到右侧与产品详情同列 */}
          {product.sampleAvailable && product.samplePrice && (
            <div>
              <Separator />
              <div className="mt-4 space-y-4">
                <h2 className="text-xl font-semibold">Sample Information</h2>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Sample Price</span>
                        <span className="text-lg font-semibold">{formatPrice(product.samplePrice)}</span>
                      </div>
                      {product.leadTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Lead Time</span>
                          <span className="text-lg">{product.leadTime}</span>
                        </div>
                      )}
                    </div>

                    {/* 样品定制和运输说明 */}
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Plane className="h-5 w-5" />
                        <span className="font-medium">Express Air Shipping</span>
                      </div>
                      <div className="text-sm text-blue-600 space-y-2">
                        <p>• Samples can be customized according to your requirements</p>
                        <p>• All samples are shipped via express air freight for faster delivery</p>
                        <p>• Sample price includes customization and air shipping costs</p>
                        <p>• Please note that air shipping contributes to the higher sample cost</p>
                      </div>
                    </div>

                    <SampleOrderButton
                      productName={product.name}
                      productId={product.id}
                      samplePrice={product.samplePrice}
                      className="w-full"
                    />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 相关产品 */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <RelatedProducts products={relatedProducts} currentProductId={product.id} />
        </div>
      )}
    </div>
  );
} 