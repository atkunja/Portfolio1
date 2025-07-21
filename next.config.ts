/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ['jgixgxypigywuodxilvf.supabase.co'],
  }
}

module.exports = nextConfig
