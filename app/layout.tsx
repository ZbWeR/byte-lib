import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "UESTC Byte Lib · 成电人的电子图书馆",
  description:
    "6 个分类、49 个站外链接、16 个概念名词。把成电人真正用得上的网站和黑话收进一个轻量的电子图书馆。",
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
        fontMono.variable,
        inter.variable
      )}
    >
      <body className="overflow-x-hidden">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
