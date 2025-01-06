/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'jewelry-display-website.vercel.app']
    },
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
    turbotrace: {
      logLevel: 'error',
      logDetail: false,
      memoryLimit: 4096
    }
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: true,
  staticPageGenerationTimeout: 120,
  compiler: {
    removeConsole: true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        path: false,
        os: false
      };
    }

    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false
        }
      }
    };

    return config;
  },
  poweredByHeader: false,
  generateBuildId: () => 'build',
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  compress: true
}

module.exports = nextConfig 