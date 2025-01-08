'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gem, Paintbrush, Shield } from 'lucide-react'

const features = [
  {
    icon: <Paintbrush className="w-8 h-8" />,
    title: 'Handcrafted Excellence',
    description: 'Each piece is meticulously crafted by skilled artisans, preserving centuries-old techniques'
  },
  {
    icon: <Gem className="w-8 h-8" />,
    title: 'Timeless Design',
    description: 'Blending traditional and modern design principles to create enduring elegance'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Premium Materials',
    description: 'Sourcing the finest materials globally to create pieces of unparalleled quality'
  }
]

export default function BrandFeatures() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20 max-w-2xl mx-auto"
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe that each piece of jewelry should be a work of art, a perfect expression of its wearer's personality.
            This is not just our promise, but our relentless pursuit of perfection.
          </p>
        </motion.div>
      </div>
    </section>
  )
} 