"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.includes('/admin') || false

  return (
    <html lang="en" suppressHydrationWarning> 
    <head>
      <title>HCCC Gameroom</title>
      <meta name="description" content="HCCC Gameroom - Your premier gaming destination in Cedar Park and Liberty Hill, Texas" />
      <meta name="generator" content="Rtn Global" />
    </head>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {isAdmin ? null : <Footer />}
    </div>
    </html>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutContent>
            {children}
          </LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  )
}
