import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"

import "./globals.css"
import { AppShell } from "@/components/app-shell"
import { ThemeProvider } from "@/components/theme-provider"
import { catalog } from "@/lib/data/catalog"
import { cn } from "@/lib/utils"

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "UESTC Byte Lib · 成电人的电子图书馆",
    template: "%s · UESTC Byte Lib",
  },
  description: `${catalog.stats.collegeCount} 个学院、${catalog.stats.docCount} 篇期末复习文档，按学院收录成电人自己整理的飞书笔记。`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(
        "overflow-x-hidden font-sans antialiased",
        fontMono.variable
      )}
    >
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
