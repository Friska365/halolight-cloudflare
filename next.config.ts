import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 安全：移除 X-Powered-By 响应头
  poweredByHeader: false,

  // 打包优化
  compiler: {
    // 移除 console.log（生产环境）
    removeConsole: isProduction
      ? {
          exclude: ["error", "warn"],
        }
      : false,
  },

  // 实验性功能
  experimental: {
    // 优化包导入 - 减少打包体积
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "framer-motion",
      "@tanstack/react-query",
      "recharts",
      "date-fns",
      "zustand",
    ],
    // 启用服务端 Actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // 图片优化 - Cloudflare 不支持 Next.js 内置图片优化
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // Cloudflare Workers 不支持图片优化
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },

  // 压缩优化
  compress: true,

  // 生产环境 source map 关闭以减小体积
  productionBrowserSourceMaps: false,

  // 静态资源缓存
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/fonts/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  // 重定向规则
  async redirects() {
    return [];
  },

  // 忽略构建时的 ESLint 错误（CI 中单独检查）
  eslint: {
    ignoreDuringBuilds: process.env.CI === "true",
  },

  // 忽略 TypeScript 构建错误（CI 中单独检查）
  typescript: {
    ignoreBuildErrors: process.env.CI === "true",
  },

  // 部署环境信息
  env: {
    NEXT_PUBLIC_DEPLOY_PLATFORM: "cloudflare",
  },
};

export default nextConfig;
