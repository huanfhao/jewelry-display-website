/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    appDir: true,
    serverActions: true
  },
  output: 'standalone',
  productionBrowserSourceMaps: false,
  onError: async (err) => {
    console.error('Server Error:', err);
  },
  logging: {
    level: 'verbose'
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src')
    };
    return config;
  }
}

module.exports = nextConfig 