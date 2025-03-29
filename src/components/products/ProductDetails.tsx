'use client'

import { Product } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { WhatsAppInquiry } from './WhatsAppInquiry';
import { usePathname } from 'next/navigation';

interface ProductDetailsProps {
  product: Product & {
    _count: {
      inquiries: number;
    };
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const pathname = usePathname();
  const productUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://syjewelrydisplay.cn'}${pathname}`;

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">
            {product._count.inquiries} inquiries
          </Badge>
          {product.customizable && (
            <Badge variant="secondary">Customizable</Badge>
          )}
        </div>
      </div>

      {/* 产品描述 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Product Description</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
      </div>

      <Separator />

      {/* 产品规格 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Specifications</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm font-medium">Price</span>
            <span className="text-xl font-bold">{formatPrice(product.price)}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm font-medium">Minimum Order</span>
            <span className="text-lg">{product.minOrderQuantity} units</span>
          </div>
          {product.material && (
            <div>
              <span className="text-sm font-medium">Material</span>
              <p className="mt-1">{product.material}</p>
            </div>
          )}
          {product.leadTime && (
            <div>
              <span className="text-sm font-medium">Lead Time</span>
              <p className="mt-1">{product.leadTime}</p>
            </div>
          )}
          {product.certification && product.certification.length > 0 && (
            <div>
              <span className="text-sm font-medium">Certifications</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.certification.map((cert, index) => (
                  <Badge key={index} variant="outline">{cert}</Badge>
                ))}
              </div>
            </div>
          )}
          {product.tradeTerms && product.tradeTerms.length > 0 && (
            <div>
              <span className="text-sm font-medium">Trade Terms</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.tradeTerms.map((term, index) => (
                  <Badge key={index} variant="outline">{term}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 定制选项 */}
      {product.customizable && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Customization Options</h2>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                This product can be customized according to your requirements. 
                Please use the inquiry form to discuss your customization needs.
              </p>
            </div>
          </div>
        </>
      )}

      {/* 联系按钮 */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <div className="space-y-3">
            <WhatsAppButton 
              productName={product.name}
              productId={product.id}
              className="w-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
} 