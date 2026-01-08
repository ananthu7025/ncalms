import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  turbopack: {},
  serverExternalPackages: ['postgres'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'my-pdf-uploads-bucketnca.s3.ap-southeast-2.amazonaws.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
