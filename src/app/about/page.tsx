'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { OptimizedImage } from '@/components/ui/OptimizedImage'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us | SY Jewelry Display</h1>
          <p className="text-2xl text-gray-700">Elevate Your Jewelry Presentation with Excellence</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed">
              At SY Jewelry Display, we believe that a beautifully crafted jewelry display is more than just a stand—it's a statement of elegance, professionalism, and quality. Since our establishment in 2018, we have been dedicated to providing high-end jewelry display solutions that enhance the beauty and value of your collections.
            </p>
          </div>

          {/* Company Image */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg my-12">
            <OptimizedImage
              src="/images/team.jpg"
              alt="Our professional team collaborating at a wooden table, showcasing our commitment to teamwork and excellence"
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
              priority
              quality={95}
            />
          </div>

          {/* Who We Are */}
          <section className="bg-gray-50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              With over 6 years of industry experience, we specialize in designing and manufacturing premium jewelry display trays, cases, and organizers. Our factory, covering 1,000 square meters, is equipped with advanced machinery and a skilled workforce of 30-50 professionals, ensuring top-quality craftsmanship in every piece we produce.
            </p>
          </section>

          {/* Why Choose Us */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <span className="text-green-500 text-2xl">✔</span>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Expert Craftsmanship</h3>
                  <p className="text-gray-600">We use a combination of solid wood, PU leather, and soft velvet lining, finished with a metal frame to create a luxurious and durable display.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-green-500 text-2xl">✔</span>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Elegant & Functional Design</h3>
                  <p className="text-gray-600">Our minimalist yet sophisticated designs cater to high-end jewelers, independent designers, and retail boutiques.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-green-500 text-2xl">✔</span>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Trusted by Global Clients</h3>
                  <p className="text-gray-600">We proudly serve jewelers in the USA, Canada, UAE, and beyond, offering reliable worldwide shipping and premium-quality products.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-green-500 text-2xl">✔</span>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Custom Solutions</h3>
                  <p className="text-gray-600">Whether you need custom branding, specific sizes, or exclusive designs, our team is here to bring your vision to life.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Mission */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are committed to helping jewelry brands and retailers showcase their collections with style and confidence. Every detail matters, and our displays are designed to protect, enhance, and elevate your jewelry pieces.
            </p>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="space-y-4">
              <p className="text-xl text-blue-600">
                <span className="text-blue-500 mr-2">🔹</span>
                Join the many jewelers worldwide who trust SY Jewelry Display for their presentation needs.
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Contact Us Today
                </Link>
                <p className="mt-4 text-gray-600">
                  Find the perfect display solution for your business!
                </p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
} 