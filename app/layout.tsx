import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { AppShell } from "@/components/app-shell"
import { catalog } from "@/lib/data/catalog"
import { cn } from "@/lib/utils"

const UMAMI_WEBSITE_ID = "fad4a8b8-81a4-43be-9404-98fb17992674"

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={cn("overflow-x-hidden font-sans", fontMono.variable)}
    >
      <body className="overflow-x-hidden">
        <AppShell>{children}</AppShell>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
