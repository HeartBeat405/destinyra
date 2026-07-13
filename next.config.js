/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce webpack memory footprint during build (helps on low-RAM machines).
  experimental: {
    webpackMemoryOptimizations: true,
    // Server Actions default to a 1MB body limit; raise it so image/logo
    // uploads (media service allows up to 10MB) don't get rejected by the
    // framework before reaching our handler.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

module.exports = nextConfig;
