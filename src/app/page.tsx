'use client'

import Link from 'next/link'
import { FeaturedProducts } from '@/components/products/FeaturedProducts'
import Script from 'next/script'
import { motion } from 'framer-motion'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  // 预加载产品页面路径
  const preloadProductsPage = () => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = '/products'
    document.head.appendChild(link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SaleSmartly 追踪脚本 */}
      <Script src="https://assets.salesmartly.com/js/project_130814_135863_1726902439.js" />
      
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[450px] rounded-xl overflow-hidden mb-16 shadow-2xl"
      >
        <OptimizedImage
          src="/images/banner.jpg"
          alt="SY Jewelry Display Banner"
          width={1920}
          height={1080}
          priority={true}
          quality={95}
          className="object-cover h-full w-full"
          sizes="100vw"
          loading="eager"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHSIeHx8dIigjJCUmJSQkIiYoLS0tKCEiMkExMC47PDw/PUJFRUVGRkdGR0b/2wBDARUXFx4aHh4jHh4jRjUmNUZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkb/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-10">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-bold text-white mb-4 max-w-xl leading-tight"
          >
            Professional Jewelry Display Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/90 mb-8 max-w-xl"
          >
            Elevate your retail experience with premium quality displays
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-300 inline-block w-fit shadow-lg"
              onMouseEnter={preloadProductsPage}
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-16 shadow-lg border border-blue-100"
      >
        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">SY Jewelry Display - China's Leading Jewelry Display Manufacturer</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Professional jewelry display solutions for global businesses</p>
        <div className="space-x-6">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 inline-block"
            >
              Register
            </Link>
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/products"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 inline-block border border-indigo-600"
              onMouseEnter={preloadProductsPage}
            >
              Browse Products
            </Link>
          </motion.span>
        </div>
      </motion.div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Us Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20 bg-white rounded-2xl p-12 shadow-lg border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-4 text-center">About Us | SY Jewelry Display</h2>
        <h3 className="text-2xl text-center text-gray-700 mb-8">Elevate Your Jewelry Presentation with Excellence</h3>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          <p className="text-gray-600 leading-relaxed">
            At SY Jewelry Display, we believe that a beautifully crafted jewelry display is more than just a stand—it's a statement of elegance, professionalism, and quality. Since our establishment in 2018, we have been dedicated to providing high-end jewelry display solutions that enhance the beauty and value of your collections.
          </p>

          <div>
            <h4 className="text-xl font-semibold mb-3">Who We Are</h4>
            <p className="text-gray-600 leading-relaxed">
              With over 6 years of industry experience, we specialize in designing and manufacturing premium jewelry display trays, cases, and organizers. Our factory, covering 1,000 square meters, is equipped with advanced machinery and a skilled workforce of 30-50 professionals, ensuring top-quality craftsmanship in every piece we produce.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Why Choose Us?</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✔</span>
                <span><strong>Expert Craftsmanship</strong> – We use a combination of solid wood, PU leather, and soft velvet lining, finished with a metal frame to create a luxurious and durable display.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✔</span>
                <span><strong>Elegant & Functional Design</strong> – Our minimalist yet sophisticated designs cater to high-end jewelers, independent designers, and retail boutiques.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✔</span>
                <span><strong>Trusted by Global Clients</strong> – We proudly serve jewelers in the USA, Canada, UAE, and beyond, offering reliable worldwide shipping and premium-quality products.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✔</span>
                <span><strong>Custom Solutions</strong> – Whether you need custom branding, specific sizes, or exclusive designs, our team is here to bring your vision to life.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Our Mission</h4>
            <p className="text-gray-600 leading-relaxed">
              We are committed to helping jewelry brands and retailers showcase their collections with style and confidence. Every detail matters, and our displays are designed to protect, enhance, and elevate your jewelry pieces.
            </p>
          </div>

          <div className="text-center space-y-4 pt-4">
            <p className="text-blue-600">
              <span className="text-blue-500 mr-2">🔹</span>
              Join the many jewelers worldwide who trust SY Jewelry Display for their presentation needs.
            </p>
            <p className="text-blue-600">
              <span className="mr-2">📩</span>
              <Link href="/contact" className="hover:underline">
                Contact us today to find the perfect display solution for your business!
              </Link>
            </p>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl"
      >
        <h2 className="text-3xl font-bold mb-12 text-center relative">
          Why Choose Us?
          <span className="absolute bottom-0 left-1/2 w-20 h-1 bg-blue-500 transform -translate-x-1/2 mt-2"></span>
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
          <motion.div 
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Quality Suppliers</h3>
            <p className="text-gray-600">Carefully selected Chinese jewelry manufacturers ensuring product quality and consistency</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Wholesale Pricing</h3>
            <p className="text-gray-600">Direct factory connections for the best wholesale prices and competitive margins</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">One-Stop Service</h3>
            <p className="text-gray-600">Professional support from inquiry to delivery with dedicated account managers</p>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="my-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Retail Space?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">Join hundreds of businesses who have already elevated their jewelry displays with our premium solutions.</p>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/contact"
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-95 inline-block shadow-lg"
          >
            Contact Us Today
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}
