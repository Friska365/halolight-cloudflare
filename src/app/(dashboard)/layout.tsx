import * as React from "react"

import { AdminLayout } from "@/components/layout/admin-layout"

// OpenNext Cloudflare 自动在边缘运行整个应用

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}
