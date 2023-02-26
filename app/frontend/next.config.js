/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // http://localhost:3000/api/proxyとしてリクエスト受け取った時にdestinationに書き換える
        // ex. /api/proxy
        source: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/:path*`,
        // ex. http://nestjs_container:3005
        destination: `${process.env.API_BASE_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
