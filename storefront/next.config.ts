import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  typescript: {
    // ⚠️ Peligroso: permite hacer build aunque haya errores de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Peligroso: permite hacer build aunque haya errores de ESLint
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "mercur-connect.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "api.mercurjs.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api-sandbox.mercurjs.com",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "bucket-production-ca38.up.railway.app",
      },
    ],
  },
}

module.exports = nextConfig
