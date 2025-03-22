"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Calendar, Globe, LogOut, Search, Settings, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./sidebar-context"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { isCollapsed } = useSidebar()
  const [language, setLanguage] = useState<"en" | "th">("en")
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lastScrollTop = useRef(0)
  const [headerVisible, setHeaderVisible] = useState(true)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const currentScrollTop = window.scrollY

      // Detect scroll direction
      if (currentScrollTop > lastScrollTop.current && currentScrollTop > 80) {
        // Scrolling down & past threshold
        setHeaderVisible(false)
      } else {
        // Scrolling up or at top
        setHeaderVisible(true)
      }

      // Update scroll state for shadow effect
      setScrolled(currentScrollTop > 10)

      // Save current scroll position
      lastScrollTop.current = currentScrollTop
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-40 mx-4 flex h-14 items-center gap-4 rounded-xl border border-late-100 px-4 md:px-6 transition-all duration-300 ease-in-out",
        "glass-morphism",
        scrolled ? "shadow-[0_8px_30px_rgba(193,177,162,0.15)]" : "shadow-[0_4px_20px_rgba(193,177,162,0.1)]",
        headerVisible ? "top-4 opacity-100" : "top-[-80px] opacity-0",
        isCollapsed ? "md:ml-[calc(70px+1.5rem)]" : "md:ml-[calc(280px+1.5rem)]",
        "md:mr-6",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 md:max-w-sm lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-truffle-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg border border-late-200 bg-white/80 pl-8 focus-visible:ring-gold-500 h-9"
            />
          </div>
        </form>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="rounded-lg">
            <Link href="/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </Button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-lg h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-truffle-700">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] md:w-80 rounded-lg">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="cursor-pointer p-3 focus:bg-late-50">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">New client request</p>
                    <p className="text-xs text-truffle-500">John Doe sent a request to become a client</p>
                    <p className="text-xs text-truffle-400">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-lg">
            <DropdownMenuItem
              className={cn("cursor-pointer rounded-md", language === "en" && "bg-gold-50")}
              onClick={() => setLanguage("en")}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn("cursor-pointer rounded-md font-ibm", language === "th" && "bg-gold-50")}
              onClick={() => setLanguage("th")}
            >
              ภาษาไทย
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-lg p-0">
              <div className="h-9 w-9 rounded-lg bg-truffle-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-lg">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-late-50">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-late-50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-late-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

