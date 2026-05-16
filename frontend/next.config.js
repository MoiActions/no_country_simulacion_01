/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/icon' }];
  },
};

module.exports = nextConfig;
