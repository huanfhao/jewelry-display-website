/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'placehold.co',
      'plus.unsplash.com'
    ],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: true
  },
  output: 'standalone',
  productionBrowserSourceMaps: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src')
    };
    return config;
  }
}

module.exports = nextConfig 