# HaloLight Cloudflare

[![CI](https://github.com/halolight/halolight-cloudflare/actions/workflows/ci.yml/badge.svg)](https://github.com/halolight/halolight-cloudflare/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/halolight/halolight-cloudflare/blob/main/LICENSE)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Deployed-F38020.svg?logo=cloudflare)](https://halolight-cloudflare.h7ml.cn)
[![pnpm](https://img.shields.io/badge/pnpm-10-ffa41c.svg)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-%23000000.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-%2361DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Workers-Edge%20Runtime-F38020.svg)](https://workers.cloudflare.com/)

HaloLight 后台管理系统的 **Cloudflare 部署版本**，基于 Next.js 15 App Router + React 19 构建，使用 `@opennextjs/cloudflare` 适配 Cloudflare Workers/Pages 边缘运行时，实现全球低延迟访问。

- 在线预览：<https://halolight-cloudflare.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-cloudflare>
- 原版（Vercel）：<https://halolight.h7ml.cn>

## 功能亮点

- **Next.js 15 + React 19**：最新框架版本，支持 Server Actions、Turbopack 开发
- **Cloudflare Edge Runtime**：全球 300+ 边缘节点，超低延迟访问
- **@opennextjs/cloudflare**：无缝适配 Next.js 到 Cloudflare Workers
- **Tailwind CSS 4 + shadcn/ui**：原子化样式、Radix UI 原语、流畅主题切换
- **Cloudflare 服务集成**：支持 KV、D1、R2、Queues、Durable Objects、Workers AI
- **零冷启动**：边缘运行，响应速度 < 50ms
- **TypeScript 全栈**：类型安全的开发体验

## 与原版差异

| 特性 | 原版 (halolight) | Cloudflare 版 |
|------|------------------|---------------|
| Next.js | 14.x | 15.5.x |
| React | 18.x | 19.x |
| 运行时 | Node.js (Vercel) | Cloudflare Workers (Edge) |
| 部署平台 | Vercel / Docker | Cloudflare Pages |
| 开发工具 | webpack | Turbopack |
| 部署命令 | `pnpm build && pnpm start` | `pnpm deploy` |
| SSR 位置 | 服务器/Serverless | 全球边缘节点 |

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Wrangler CLI（需登录 Cloudflare）

### 安装

```bash
git clone https://github.com/halolight/halolight-cloudflare.git
cd halolight-cloudflare
pnpm install
```

### 本地开发

```bash
pnpm dev         # 启动开发服务器（Turbopack），http://localhost:3000
```

### 本地预览（Edge 环境）

```bash
pnpm preview     # 模拟 Cloudflare Workers 环境
```

### 部署到 Cloudflare

```bash
wrangler login   # 首次需要登录
pnpm deploy      # 构建并部署
```

## 常用脚本

```bash
pnpm dev          # 启动开发服务器（Turbopack，Node.js 环境）
pnpm build        # Next.js 生产构建
pnpm preview      # 本地预览 Cloudflare 环境
pnpm deploy       # 部署到 Cloudflare
pnpm upload       # 仅上传不部署
pnpm lint         # ESLint 检查
pnpm type-check   # TypeScript 类型检查
pnpm test         # 运行单元测试（watch 模式）
pnpm test:run     # 运行单元测试（单次）
pnpm test:coverage # 运行测试并生成覆盖率报告
pnpm cf-typegen   # 生成 Cloudflare 环境类型
```

## 环境变量

### 本地开发

创建 `.dev.vars` 文件：

```bash
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_MOCK=true
NEXT_PUBLIC_APP_TITLE=HaloLight
NEXT_PUBLIC_BRAND_NAME=HaloLight
```

### 生产环境

通过 Cloudflare Dashboard 或 Wrangler 设置：

```bash
wrangler secret put API_SECRET_KEY
```

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | API 基础地址 | `/api` |
| `NEXT_PUBLIC_MOCK` | 启用 Mock 数据 | `false` |
| `NEXT_PUBLIC_APP_TITLE` | 应用标题 | `HaloLight` |
| `NEXT_PUBLIC_BRAND_NAME` | 品牌名称 | `HaloLight` |

## 目录结构

```
halolight-cloudflare/
├── src/
│   ├── app/                    # App Router 页面
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   └── ...
├── public/                     # 静态资源
├── .dev.vars                   # 本地环境变量（不提交）
├── .open-next/                 # OpenNext 构建产物（自动生成）
├── cloudflare-env.d.ts         # Cloudflare 环境类型
├── open-next.config.ts         # OpenNext 配置
├── wrangler.jsonc              # Wrangler 配置
├── next.config.ts              # Next.js 配置
├── CLAUDE.md                   # Claude Code 开发指南
└── package.json
```

## Cloudflare 配置

### wrangler.jsonc

```jsonc
{
  "name": "halolight-cloudflare",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  }
}
```

### 使用 Cloudflare 服务

```ts
import { getRequestContext } from '@opennextjs/cloudflare';

export async function GET() {
  const { env } = getRequestContext();
  const value = await env.MY_KV.get('key');
  return Response.json({ value });
}
```

## Edge Runtime 约束

Cloudflare Workers 是边缘运行时，部分 Node.js API 不可用：

- `fs` - 文件系统
- `child_process` - 子进程
- `net`、`dgram` - 原生网络

项目已启用 `nodejs_compat` 兼容层，部分 API 可用（如 `Buffer`、`process.env`）。

详细说明参见 [CLAUDE.md](./CLAUDE.md)。

## 部署架构

```
用户请求 → Cloudflare CDN → Workers (Edge) → KV/D1/R2/外部 API
                ↓
          全球 300+ 节点
          就近响应 < 50ms
```

## CI/CD

项目已配置完整的 GitHub Actions CI 工作流（`.github/workflows/ci.yml`）：

| Job | 说明 |
|-----|------|
| **lint** | ESLint + TypeScript 类型检查 |
| **test** | Vitest 单元测试 + Codecov 覆盖率上传 |
| **build** | OpenNext Cloudflare 生产构建 |
| **security** | 依赖安全审计 |
| **dependency-review** | PR 依赖变更审查 |

### 部署示例

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 相关链接

- [在线预览（Cloudflare）](https://halolight-cloudflare.h7ml.cn)
- [在线预览（原版 Vercel）](https://halolight.h7ml.cn)
- [GitHub 仓库](https://github.com/halolight/halolight-cloudflare)
- [问题反馈](https://github.com/halolight/halolight-cloudflare/issues)
- [OpenNext 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)
