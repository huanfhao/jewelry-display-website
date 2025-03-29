import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'Contact for price';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: Date | string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 生成 WhatsApp 询单链接
 * @param productName 产品名称
 * @param productId 产品ID (SKU)
 */
export function generateWhatsAppLink(productName: string, productId: string): string {
  const message = encodeURIComponent(
    `Hi SY Jewelry Display,\n\n` +
    `I'm interested in your product: ${productName}\n` +
    `Product SKU: ${productId}\n\n` +
    `Could you please provide more information about:\n` +
    `- Price and MOQ\n` +
    `- Customization options\n` +
    `- Delivery time\n\n` +
    `Thank you!`
  );
  
  return `https://wa.me/8615395787004?text=${message}`;
}

/**
 * 生成 WhatsApp 询盘链接（带URL）
 * @param productName 产品名称
 * @param productUrl 产品URL
 * @param productId 产品ID (SKU)
 */
export function generateWhatsAppInquiryLink(productName: string, productUrl: string, productId: string): string {
  const message = encodeURIComponent(
    `Hi SY Jewelry Display,\n\n` +
    `I'm interested in your product: ${productName}\n` +
    `Product SKU: ${productId}\n` +
    `Product URL: ${productUrl}\n\n` +
    `Could you please provide more information about:\n` +
    `- Price and MOQ\n` +
    `- Customization options\n` +
    `- Delivery time\n\n` +
    `Thank you!`
  );
  
  return `https://wa.me/8615395787004?text=${message}`;
}

/**
 * 生成样品询单 WhatsApp 链接
 * @param productName 产品名称
 * @param samplePrice 样品价格
 * @param productId 产品ID (SKU)
 */
export function generateSampleInquiryLink(productName: string, samplePrice: number, productId: string): string {
  const message = encodeURIComponent(
    `Hi SY Jewelry Display,\n\n` +
    `I would like to order a sample of: ${productName}\n` +
    `Product SKU: ${productId}\n\n` +
    `Sample price shown: ${formatPrice(samplePrice)}\n\n` +
    `Please provide:\n` +
    `- Payment method\n` +
    `- Shipping options and cost\n` +
    `- Estimated delivery time\n\n` +
    `Thank you!`
  );
  
  return `https://wa.me/8615395787004?text=${message}`;
}