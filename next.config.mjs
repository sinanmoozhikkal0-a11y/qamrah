import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-router-dom': path.resolve(process.cwd(), 'src/utils/router.jsx')
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      'react-router-dom': './src/utils/router.jsx'
    }
  }
};

export default nextConfig;
