/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // ex. /api/proxy
        source: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/:path*`,
        // ex. http://localhost:8000
        destination: `${process.env.API_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
