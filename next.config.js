/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
}

module.exports = nextConfig 