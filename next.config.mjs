/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'imgs.search.brave.com' }],
  },
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
}

export default nextConfig
