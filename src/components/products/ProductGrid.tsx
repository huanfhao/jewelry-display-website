'use client'

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

interface Product {
  title: string;
  image: string;
  description: string;
  slug: string;
  category?: {
    name: string;
  };
  price?: number;
  _count?: {
    inquiries: number;
  };
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (slug: string) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductCard
            title={product.title}
            image={product.image}
            description={product.description}
            slug={product.slug}
            category={product.category?.name}
            price={product.price}
            inquiryCount={product._count?.inquiries}
            onClick={() => onProductClick(product.slug)}
          />
        </motion.div>
      ))}
    </div>
  );
} 