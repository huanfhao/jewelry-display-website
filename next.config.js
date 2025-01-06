/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'jewelry-display-website.vercel.app']
    }
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: true
}

module.exports = nextConfig 