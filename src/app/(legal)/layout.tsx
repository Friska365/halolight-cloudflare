import * as React from "react"

import { LegalLayoutContent } from "@/components/layout/legal-layout-content"

// OpenNext Cloudflare 自动在边缘运行整个应用

interface LegalLayoutProps {
  children: React.ReactNode
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return <LegalLayoutContent>{children}</LegalLayoutContent>
}
