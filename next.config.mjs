/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'img.clerk.com',
      'images.clerk.dev',
      'pub-placeholder.r2.dev' // Replace with your R2 public domain
    ],
  },
  // Ensure src directory is prioritized
};

export default nextConfig;