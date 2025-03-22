import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { SidebarProvider } from "@/components/layout/sidebar-context"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BackToTop } from "@/components/layout/back-to-top"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WealthBeeing - Financial Advisory Platform",
  description: "Premium financial advisory platform for wealth management professionals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen bg-late-50/30">
              <Sidebar />
              <div className="flex flex-1 flex-col w-full transition-all duration-300 ease-in-out content-container">
                <Header />
                <main className="flex-1 p-4 md:p-6 mt-16">{children}</main>
              </div>
              <BackToTop />
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'