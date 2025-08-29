/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    // Allow production builds to successfully complete even if there are TypeScript errors.
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors.
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig