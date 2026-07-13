/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce webpack memory footprint during build (helps on low-RAM machines).
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

module.exports = nextConfig;
