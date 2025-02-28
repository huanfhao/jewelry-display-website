/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: process.env.NODE_ENV !== 'production'
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development'
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development'
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