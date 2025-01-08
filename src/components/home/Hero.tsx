'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      {/* Left Content */}
      <div className="absolute inset-0 w-1/2 flex items-center justify-center p-12">
        <div className="max-w-xl">
          <motion.h1 
            className="text-6xl font-light mb-8 leading-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block">Professional</span>
            <span className="block font-semibold">Jewelry Display</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 mb-12 leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Creating distinctive display solutions for your jewelry store. We specialize in custom showcase design and professional display equipment to enhance the presentation of each piece.
          </motion.p>

          <motion.div
            className="space-x-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/products" 
              className="text-lg border-b-2 border-black pb-1 hover:border-gray-400 transition-colors"
            >
              View Products
            </Link>
            <Link 
              href="/about" 
              className="text-lg border-b-2 border-transparent pb-1 hover:border-black transition-colors"
            >
              About Us
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right Image */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2">
        <div className="relative h-full">
          <Image
            src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d"
            alt="Professional Jewelry Display"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="50vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-12">
        <motion.div 
          className="flex items-center space-x-4 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="w-12 h-[1px] bg-gray-400" />
          <span className="text-gray-400">Custom Design · Elegant Presentation</span>
        </motion.div>
      </div>
    </div>
  )
} 