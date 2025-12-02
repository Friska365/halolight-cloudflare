# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是 HaloLight 后台管理系统的 **Cloudflare 部署版本**，基于 Next.js 15 App Router + React 19 构建，使用 `@opennextjs/cloudflare` 适配 Cloudflare Workers/Pages 边缘运行时。

### 与原版差异

| 特性 | 原版 (halolight) | Cloudflare 版 |
|------|------------------|---------------|
| Next.js | 14.x | 15.5.x |
| React | 18.x | 19.x |
| Tailwind CSS | 4.x | 4.x |
| 运行时 | Node.js (Vercel/自托管) | Cloudflare Workers (Edge) |
| 部署平台 | Vercel / Docker | Cloudflare Pages |
| 开发工具 | webpack | Turbopack |
| 适配层 | - | @opennextjs/cloudflare |
| 部署命令 | `pnpm build && pnpm start` | `pnpm deploy` (OpenNext + Wrangler) |
| SSR 位置 | 服务器/Serverless | 全球边缘节点 |

## 技术栈速览

- **框架**: Next.js 15 App Router + React 19 + TypeScript
- **样式**: Tailwind CSS 4、shadcn/ui (Radix UI)、lucide-react
- **运行时**: Cloudflare Workers (Edge Runtime)
- **部署**: @opennextjs/cloudflare + Wrangler 4.x
- **测试**: Vitest + @testing-library/react + jsdom
- **构建工具**: pnpm、Turbopack (dev)

## 前置要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Wrangler**: 已登录 (`wrangler login`)
- **Cloudflare 账号**: 需要 Account ID（用于部署）

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (Turbopack, Node.js 环境)
pnpm build        # 生产构建
pnpm preview      # 本地预览 Cloudflare 环境 (OpenNext build + Wrangler preview)
pnpm deploy       # 部署到 Cloudflare (OpenNext build + Wrangler deploy)
pnpm upload       # 仅上传不部署
pnpm lint         # ESLint 检查
pnpm type-check   # TypeScript 类型检查
pnpm test         # 运行单元测试 (watch 模式)
pnpm test:run     # 运行单元测试 (单次)
pnpm test:coverage # 运行测试并生成覆盖率报告
pnpm cf-typegen   # 生成 Cloudflare 环境类型
# pnpm start      # ⚠️ 不适用于 Cloudflare 版本
```

**命令执行流程**：
- `pnpm preview` = `opennextjs-cloudflare build` → `opennextjs-cloudflare preview`
- `pnpm deploy` = `opennextjs-cloudflare build` → `opennextjs-cloudflare deploy`

## 运行时约束 (Edge Runtime)

### Node.js 兼容层

项目已启用 `nodejs_compat` 兼容标志，部分 Node.js API 可用但存在限制：

**不可用的 API**：
- `fs` - 文件系统操作
- `child_process` - 子进程
- `net`、`dgram` - 原生网络套接字
- `crypto.createCipher` 等旧加密 API（使用 Web Crypto API）

**部分可用**（通过 nodejs_compat）：
- `Buffer` - 二进制数据处理
- `process.env` - 环境变量
- `crypto` 部分 API - 如 `randomUUID()`

> 注意：`nodejs_compat` 有性能开销，建议优先使用 Web 标准 API。

### 可用的 Cloudflare 服务

| 服务 | 用途 | 状态 |
|------|------|------|
| KV | 键值存储 | 可用 |
| D1 | SQLite 数据库 | 可用 |
| R2 | 对象存储 | 可用 |
| Queues | 消息队列 | 可用 |
| Durable Objects | 有状态对象 | 可用 |
| Workers AI | AI 推理 | 可用 |

### 配额限制

> **重要**：以下为参考值，实际限制请查阅 [Cloudflare 官方文档](https://developers.cloudflare.com/workers/platform/limits/)。

- **Worker 脚本大小**: 压缩后 1MB (免费) / 10MB (付费)
- **CPU 时间**: 取决于计划，免费约 10-50ms，付费可达数秒
- **内存**: 128MB
- **子请求数**: 50 (免费) / 1000 (付费)
- **请求持续时间**: 最长 30s
- **冷启动**: 通常 < 50ms

## 配置文件

### wrangler.jsonc

Cloudflare Workers 配置文件，关键字段：

```jsonc
{
  "name": "my-next-app",           // Workers 名称
  "main": ".open-next/worker.js",  // 入口文件
  "compatibility_date": "2025-03-01",
  "compatibility_flags": [
    "nodejs_compat",               // Node.js 兼容层
    "global_fetch_strictly_public"
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  }
}
```

### open-next.config.ts

OpenNext Cloudflare 适配配置：

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // 可选：启用 R2 增量缓存
  // incrementalCache: r2IncrementalCache,
});
```

## 环境变量

### 公共变量 vs 私密变量

| 类型 | 前缀 | 访问范围 | 配置方式 |
|------|------|----------|----------|
| 公共变量 | `NEXT_PUBLIC_` | 客户端 + 服务端 | `.dev.vars` / Dashboard |
| 私密变量 | 无前缀 | 仅服务端 (Edge) | `wrangler secret` / Dashboard |

### 本地开发

创建 `.dev.vars` 文件（不提交到 git）：

```bash
# 公共变量（客户端可见）
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_MOCK=true           # 本地开发启用 Mock
NEXT_PUBLIC_APP_TITLE=HaloLight
NEXT_PUBLIC_BRAND_NAME=HaloLight

# 私密变量（仅服务端）
API_SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
```

### 生产环境

**公共变量**：通过 Cloudflare Dashboard → Settings → Environment Variables 设置。

**私密变量**：通过 Wrangler 或 Dashboard 的 Secrets 设置：

```bash
wrangler secret put API_SECRET_KEY
```

### 常用环境变量

| 变量名 | 说明 | 默认值 | 生产建议 |
|--------|------|--------|----------|
| `NEXT_PUBLIC_API_URL` | API 基础 URL | `/api` | 按实际配置 |
| `NEXT_PUBLIC_MOCK` | 启用 Mock 数据 | - | `false` |
| `NEXT_PUBLIC_APP_TITLE` | 应用标题 | `HaloLight` | 自定义 |
| `NEXT_PUBLIC_BRAND_NAME` | 品牌名称 | `HaloLight` | 自定义 |

## 路由与渲染策略

### Edge Runtime 说明

使用 `@opennextjs/cloudflare` 时，**整个应用自动运行在边缘环境**，无需在页面或布局中手动声明 `export const runtime = 'edge'`。

OpenNext Cloudflare 会在构建时自动处理 runtime 适配，将所有服务端代码转换为 Cloudflare Workers 兼容格式。

> **注意**：如果手动声明 `runtime = 'edge'`，可能会导致 OpenNext 构建失败，因为它要求 edge runtime 函数必须在单独的函数中定义。

```ts
// middleware.ts - 中间件自动运行在 Edge
import { NextResponse } from 'next/server';
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
```

> 中间件会自动运行在边缘环境，无需额外配置。

### SSR/SSG/ISR 支持

| 渲染模式 | 支持状态 | 说明 |
|----------|----------|------|
| SSR | ✅ 支持 | 每次请求在边缘渲染 |
| SSG | ✅ 支持 | 构建时生成静态页面 |
| ISR | ⚠️ 部分 | 需配置 R2 缓存，`revalidate` 依赖缓存层 |

### ISR 配置（可选）

启用 R2 增量缓存以支持 `revalidate`：

```ts
// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```

**未启用 ISR 时**：`revalidate` 配置会被忽略，页面行为类似 SSG（构建时生成，不自动更新）。

## 部署流程

### 首次部署

1. 登录 Cloudflare：
   ```bash
   wrangler login
   ```

2. 配置项目名称（wrangler.jsonc）

3. 部署：
   ```bash
   pnpm deploy
   ```

### CI/CD 集成

```yaml
# .github/workflows/deploy.yml
- name: Deploy to Cloudflare
  run: pnpm deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

### 版本回滚

Cloudflare Pages 保留历史部署，可通过以下方式回滚：

1. **Dashboard 回滚**：
   - Cloudflare Dashboard → Workers & Pages → 项目 → Deployments
   - 选择历史版本 → "Rollback to this deployment"

2. **重新部署指定提交**：
   ```bash
   git checkout <commit-hash>
   pnpm deploy
   ```

## 本地开发与调试

### 开发模式

```bash
pnpm dev
```

使用 Turbopack 提供快速 HMR，但**运行在 Node.js 环境**，无法检测 Edge 兼容性问题。

### 预览模式（推荐测试 Edge 兼容性）

```bash
pnpm preview
```

模拟 Cloudflare Workers 环境，检测 Edge Runtime 兼容性问题。

**预览与生产的差异**：
- 本地预览不包含 Smart Placement（全球就近路由）
- 缓存行为可能与生产环境不同
- 不支持完整的 Cloudflare 网络特性（如 Argo）

### Edge 兼容性检查清单

部署前检查：
- [ ] 是否使用了 `fs`、`child_process` 等不支持的 API
- [ ] 第三方依赖是否兼容 Edge Runtime
- [ ] API Routes 是否声明了 `runtime: 'edge'`
- [ ] `pnpm preview` 是否正常运行

### 日志查看

- **本地开发**: 控制台输出
- **本地预览**: Wrangler 日志输出
- **生产环境**:
  ```bash
  wrangler tail  # 实时日志流
  ```
  或通过 Cloudflare Dashboard → Workers & Pages → 日志

### 观测性配置

项目已启用 Cloudflare Observability（见 `wrangler.jsonc`）：
```jsonc
"observability": { "enabled": true }
```

可在 Cloudflare Dashboard 查看请求追踪、错误率、延迟分布等指标。

## 兼容性与迁移

### React 19 新特性

- `use()` Hook - 在渲染中读取 Promise/Context
- Server Actions - 表单直接调用服务端函数
- 新的 `useFormStatus`、`useOptimistic` Hooks

### Next.js 15 变化

- Turbopack 稳定用于开发
- 改进的 App Router 性能
- 更严格的类型检查

### Tailwind CSS 4 迁移

- 新的配置语法
- 改进的 JIT 编译
- 原子化 CSS 性能优化

## 常见问题

### 1. "Cannot find module 'fs'" 错误

Edge Runtime 不支持 Node.js 内置模块。使用 Web API 替代或标记为仅服务端代码。

### 2. 构建体积过大

- 检查依赖是否有 Node.js 专用代码
- 使用 `@cloudflare/next-on-pages` 分析器
- 考虑动态导入拆分代码

### 3. 冷启动慢

- 减少 Worker 脚本体积
- 使用 Smart Placement 就近部署
- 预热关键路径

## 架构对比

### 原版架构 (Node.js)

```
Client → Vercel → Next.js (Node.js) → API
```

### Cloudflare 版架构 (Edge)

```
Client → Cloudflare CDN → Workers (Edge) → KV/D1/R2/API
```

## 目录结构

```
halolight-cloudflare/
├── src/
│   ├── app/                    # App Router 页面
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── __tests__/              # 单元测试
│   │   ├── setup.tsx           # 测试初始化
│   │   ├── test-utils.tsx      # 测试工具
│   │   └── config/             # 配置测试
│   └── ...                     # 同原版结构
├── public/                     # 静态资源
├── .github/workflows/          # GitHub Actions CI
├── .dev.vars                   # 本地环境变量（不提交到 git）
├── .open-next/                 # OpenNext 构建产物（自动生成，不提交）
│   ├── worker.js               # Worker 入口
│   └── assets/                 # 静态资源
├── coverage/                   # 测试覆盖率报告（自动生成，不提交）
├── cloudflare-env.d.ts         # Cloudflare 环境类型（自动生成）
├── vitest.config.ts            # Vitest 测试配置
├── open-next.config.ts         # OpenNext 配置
├── wrangler.jsonc              # Wrangler 配置
├── next.config.ts              # Next.js 配置
└── package.json
```

> `.open-next/` 目录由 `opennextjs-cloudflare build` 生成，包含部署到 Cloudflare 的所有产物。

## 新增功能开发指南

### 使用 Cloudflare 服务

1. 在 `wrangler.jsonc` 添加 binding 配置
2. 运行 `pnpm cf-typegen` 生成类型
3. 在代码中通过 `getRequestContext()` 访问

```ts
import { getRequestContext } from '@opennextjs/cloudflare';

export async function GET() {
  const { env } = getRequestContext();
  const value = await env.MY_KV.get('key');
  return Response.json({ value });
}
```

### 添加 KV 存储

```jsonc
// wrangler.jsonc
{
  "kv_namespaces": [
    { "binding": "MY_KV", "id": "xxx" }
  ]
}
```

### 添加 D1 数据库

```jsonc
// wrangler.jsonc
{
  "d1_databases": [
    { "binding": "MY_DB", "database_id": "xxx" }
  ]
}
```
