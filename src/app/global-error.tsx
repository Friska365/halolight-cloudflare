"use client"

import { AlertTriangle, Home, RefreshCw } from "lucide-react"

// global-error.tsx 必须包含自己的 html 和 body 标签
// 因为它会在根布局出错时完全替换 layout.tsx
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-red-950/20 p-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              应用出错了
            </h1>

            <p className="text-slate-600 dark:text-slate-400 mb-8">
              抱歉，应用发生了严重错误。请尝试刷新页面或返回首页。
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center px-4 py-2 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重试
              </button>
            </div>

            {error.digest && (
              <p className="mt-8 text-xs text-slate-500 dark:text-slate-500">
                错误代码: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
