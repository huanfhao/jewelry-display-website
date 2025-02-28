'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import heroImage from '../../../public/images/about.jpg'

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO';

export default function Hero() {
  const [imgError, setImgError] = useState(false)

  const handleViewProducts = () => {
    window.open(STORE_URL, '_blank');
  };

  return (
    <div className="relative h-[90vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      {imgError ? (
        // 显示备用背景色或图片
        <div className="absolute inset-0 bg-gray-900" />
      ) : (
        <Image
          src={heroImage}
          alt="SY Jewelry Display"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={90}
          onError={(e) => {
            console.error('Image load error:', e);
            console.log('Attempted image path:', '/images/about.jpg');
            setImgError(true);
          }}
          onLoad={() => {
            console.log('Image loaded successfully');
          }}
        />
      )}
      
      {/* Content */}
      <div className="absolute inset-0 bg-black/30">
        <div className="container mx-auto h-full px-4 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:max-w-2xl text-white text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-4 md:mb-6">
              Professional
              <br className="md:hidden" />
              Display Props
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-gray-100">
              Enhance your jewelry presentation with our
              <br className="hidden md:block" />
              premium display props and accessories
            </p>
            <Button
              size="lg"
              onClick={handleViewProducts}
              className="w-full md:w-auto bg-white text-black hover:bg-gray-100"
            >
              View Products
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 