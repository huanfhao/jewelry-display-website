import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import ProductList from '@/components/products/ProductList'
import type { Product as PrismaProduct } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Products | SY Jewelry Display',
  description: 'Browse our wide selection of jewelry display products including ring stands, necklace holders, and custom solutions.',
  openGraph: {
    title: 'SY Jewelry Display - Products',
    description: 'Browse our wide selection of jewelry display products including ring stands, necklace holders, and custom solutions.'
  }
}

export const dynamic = 'force-dynamic'

// 定义一个与ProductList组件期望的类型匹配的备用数据类型
type ProductWithCount = PrismaProduct & {
  _count: {
    inquiries: number
  }
};

// 静态备用数据，当数据库连接失败时使用
const fallbackProducts: ProductWithCount[] = [
  {
    id: 'fallback-1',
    name: 'Elegant Ring Display Stand',
    description: 'A beautiful display stand for rings with multiple tiers.',
    price: 29.99,
    images: ['/images/products/ring-display-stand.jpg'],
    category: 'displays',
    stock: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: 'elegant-ring-display-stand',
    isFeatured: true,
    material: 'Acrylic',
    minOrderQuantity: 10,
    customizable: true,
    leadTime: '2-3 weeks',
    bulkPricing: null,
    certification: [],
    origin: null,
    packagingInfo: null,
    tradeTerms: [],
    sampleAvailable: false,
    samplePrice: null,
    _count: { inquiries: 0 }
  },
  {
    id: 'fallback-2',
    name: 'Necklace Display Bust',
    description: 'Premium quality bust form for displaying necklaces and pendants.',
    price: 39.99,
    images: ['/images/products/necklace-display.jpg'],
    category: 'displays',
    stock: 80,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: 'necklace-display-bust',
    isFeatured: true,
    material: 'Velvet',
    minOrderQuantity: 5,
    customizable: true,
    leadTime: '1-2 weeks',
    bulkPricing: null,
    certification: [],
    origin: null,
    packagingInfo: null,
    tradeTerms: [],
    sampleAvailable: false,
    samplePrice: null,
    _count: { inquiries: 0 }
  },
  {
    id: 'fallback-3',
    name: 'Jewelry Gift Box Set',
    description: 'Set of 10 premium gift boxes for jewelry items.',
    price: 24.99,
    images: ['/images/products/gift-box-set.jpg'],
    category: 'packaging',
    stock: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: 'jewelry-gift-box-set',
    isFeatured: false,
    material: 'Cardboard with velvet interior',
    minOrderQuantity: 20,
    customizable: true,
    leadTime: '1 week',
    bulkPricing: null,
    certification: [],
    origin: null,
    packagingInfo: null,
    tradeTerms: [],
    sampleAvailable: false,
    samplePrice: null,
    _count: { inquiries: 0 }
  },
  {
    id: 'fallback-4',
    name: 'Bracelet Display Rack',
    description: 'T-bar display rack for multiple bracelets and watches.',
    price: 34.99,
    images: ['/images/products/bracelet-display.jpg'],
    category: 'displays',
    stock: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: 'bracelet-display-rack',
    isFeatured: true,
    material: 'Wood',
    minOrderQuantity: 8,
    customizable: true,
    leadTime: '2 weeks',
    bulkPricing: null,
    certification: [],
    origin: null,
    packagingInfo: null,
    tradeTerms: [],
    sampleAvailable: false,
    samplePrice: null,
    _count: { inquiries: 0 }
  }
];

// 唤醒数据库
async function warmupDatabase() {
  try {
    await fetch('/api/db-warmup', { cache: 'no-store' });
    console.log('Database warmed up from products page');
  } catch (error) {
    console.error('Failed to warm up database from products page:', error);
  }
}

export default async function ProductsPage() {
  try {
    // 尝试预热数据库
    await warmupDatabase();
    
    // 尝试获取产品数据
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            inquiries: true
          }
        }
      }
    });

    return <ProductList products={products} />
  } catch (error) {
    console.error('Error fetching products, using fallback data:', error);
    // 如果数据库连接失败，返回静态备用数据
    return <ProductList products={fallbackProducts} />
  }
} 