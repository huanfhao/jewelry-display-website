'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/products/AddToCartButton';

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category: {
      name: string;
    };
  };
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {/* 图片展示 */}
        <motion.div variants={fadeIn} className="space-y-6">
          <div className="aspect-square relative overflow-hidden rounded-2xl bg-white shadow-xl">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYxMC8vMTQ3PEFGODlLPTQ5RWFJTlNhWVdbZ2JnP0BXcWNcWVr/2wBDARUXFyAeIBogHh4gIiAqJSUlKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-primary hover:ring-offset-2"
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                    loading="lazy"
                    quality={85}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 产品信息 */}
        <motion.div variants={fadeIn} className="space-y-8">
          <div className="space-y-4">
            <motion.h1 
              variants={fadeIn}
              className="text-4xl font-bold text-gray-900"
            >
              {product.name}
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-500"
            >
              {product.category.name}
            </motion.p>
          </div>

          <motion.p 
            variants={fadeIn}
            className="text-3xl font-bold text-primary"
          >
            {formatPrice(product.price)}
          </motion.p>

          <motion.div 
            variants={fadeIn}
            className="prose prose-gray max-w-none"
          >
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Availability:</span>
              <span className={`font-medium ${
                product.stock > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <motion.div
                variants={fadeIn}
                className="transition-all duration-300 hover:shadow-lg"
              >
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 