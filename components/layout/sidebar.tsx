"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Menu,
  PieChart,
  Settings,
  Users,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "./sidebar-context"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const NavItem = ({
    href,
    icon: Icon,
    title,
    isActive = false,
    badge,
    children,
  }: {
    href: string
    icon: React.ElementType
    title: string
    isActive?: boolean
    badge?: number
    children?: React.ReactNode
  }) => {
    const [isOpen, setIsOpen] = useState(true)
    const hasChildren = !!children

    return (
      <div className="mb-1">
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            isActive ? "bg-white/20 text-white" : "text-truffle-100 hover:bg-white/10 hover:text-white",
          )}
          onClick={
            hasChildren
              ? (e) => {
                  e.preventDefault()
                  setIsOpen(!isOpen)
                }
              : undefined
          }
        >
          <Icon className="h-5 w-5" />
          {!isCollapsed && (
            <>
              <span className="flex-1">{title}</span>
              {badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-xs font-semibold text-truffle-800">
                  {badge}
                </span>
              )}
              {hasChildren && (
                <button onClick={() => setIsOpen(!isOpen)} className="ml-auto">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              )}
            </>
          )}
        </Link>
        {!isCollapsed && hasChildren && isOpen && <div className="ml-6 mt-1 space-y-1">{children}</div>}
      </div>
    )
  }

  const SubNavItem = ({
    href,
    title,
    isActive = false,
  }: {
    href: string
    title: string
    isActive?: boolean
  }) => {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center rounded-lg px-3 py-1.5 text-sm transition-all duration-200",
          isActive ? "bg-white/10 text-white" : "text-truffle-200 hover:bg-white/10 hover:text-white",
        )}
      >
        <span>{title}</span>
      </Link>
    )
  }

  if (!mounted) return null

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        data-sidebar-trigger="true"
        className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm shadow-md rounded-lg"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={toggleMobileSidebar} />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar="true"
        data-state={isCollapsed ? "collapsed" : "expanded"}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-truffle-700 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[280px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:m-4 md:rounded-2xl md:h-[calc(100vh-2rem)] md:border md:border-truffle-600 md:shadow-xl",
          className,
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            {!isCollapsed ? (
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-lg bg-gold-400 flex items-center justify-center">
                  <span className="text-truffle-800 font-bold">WB</span>
                </div>
                <span className="ml-2 font-semibold text-white">WealthBeeing</span>
              </div>
            ) : (
              <div className="h-9 w-9 rounded-lg bg-gold-400 flex items-center justify-center">
                <span className="text-truffle-800 font-bold">WB</span>
              </div>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={toggleMobileSidebar}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white hover:bg-white/10"
              onClick={toggleSidebar}
            >
              <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="relative">
            {!isCollapsed && (
              <div className="rounded-lg bg-truffle-600/50 p-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gold-400 flex items-center justify-center">
                    <span className="text-truffle-800 font-bold">JS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">John Smith</p>
                    <p className="text-xs text-truffle-200">Financial Advisor</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1">
            <NavItem href="/dashboard" icon={LayoutDashboard} title="Dashboard" isActive={pathname === "/dashboard"} />
            <NavItem
              href="/clients"
              icon={Users}
              title="Clients"
              isActive={pathname === "/clients" || pathname.startsWith("/clients/")}
              badge={6}
            >
              <SubNavItem href="/clients" title="Client List" isActive={pathname === "/clients"} />
              <SubNavItem href="/clients/onboarding" title="Add Client" isActive={pathname === "/clients/onboarding"} />
              <SubNavItem
                href="/clients/onboarding"
                title="Client Onboarding"
                isActive={pathname === "/clients/onboarding"}
              />
            </NavItem>
            <NavItem
              href="/planning"
              icon={FileText}
              title="Financial Planning"
              isActive={pathname.startsWith("/planning")}
            >
              <SubNavItem href="/planning/cashflow" title="Cashflow" isActive={pathname === "/planning/cashflow"} />
              <SubNavItem
                href="/planning/balance-sheet"
                title="Balance Sheet"
                isActive={pathname === "/planning/balance-sheet"}
              />
              <SubNavItem
                href="/planning/education"
                title="Education Plan"
                isActive={pathname === "/planning/education"}
              />
              <SubNavItem
                href="/planning/retirement"
                title="Retirement Plan"
                isActive={pathname === "/planning/retirement"}
              />
              <SubNavItem
                href="/planning/protection"
                title="Wealth Protection"
                isActive={pathname === "/planning/protection"}
              />
              <SubNavItem
                href="/planning/health"
                title="Health & Critical Illness"
                isActive={pathname === "/planning/health"}
              />
            </NavItem>
            <NavItem href="/aum" icon={PieChart} title="AUM Dashboard" isActive={pathname.startsWith("/aum")} />
            <NavItem href="/reports" icon={BarChart3} title="Reports" isActive={pathname.startsWith("/reports")} />
            <NavItem href="/settings" icon={Settings} title="Settings" isActive={pathname.startsWith("/settings")} />
          </nav>
        </ScrollArea>
        <div className="p-3">
          {!isCollapsed && (
            <div className="rounded-lg bg-truffle-600/50 p-3">
              <p className="text-xs text-truffle-200">WealthBeeing v1.0</p>
              <p className="text-xs text-truffle-200">© 2025 WealthBeeing</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

