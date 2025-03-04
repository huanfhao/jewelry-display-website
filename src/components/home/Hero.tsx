'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO'

export default function Hero() {
  const handleRedirect = () => {
    window.location.href = STORE_URL
  }

  return (
    <section className="relative h-[80vh] min-h-[600px]">
      <Image
        src="/images/hero.jpg"
        alt="Jewelry Display Solutions"
        fill
        priority={true}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-playfair mb-6"
            >
              Professional Jewelry Display
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8"
            >
              Elevate your jewelry presentation with our premium displays
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRedirect}
              className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition duration-300"
            >
              Shop Now
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
} 