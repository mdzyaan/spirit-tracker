"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutDashboard, BarChart3, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/tracker", label: "Tracker", icon: LayoutDashboard },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-[14px] ">
              <Link
                href="/"
                className="flex items-center justify-center rounded-lg text-semantics-base-fg-default hover:opacity-80 transition-opacity"
                aria-label="Ramadan Tracker"
              >
                {state === "collapsed" && !isMobile ? (
                  <Image src="/star.png" alt="Ramadan Tracker" width={32} height={32} />
                ) : (
                  <span className="font-semibold text-sm text-semantics-base-fg-muted-2 flex  gap-2">
                    <Image src="/star.png" alt="Ramadan Tracker" width={16} height={16} />
                    Ramadan Tracker
                  </span>
                )}
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href + "/"))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    isActive={isActive}
                    className={cn(
                      "text-semantics-base-fg-muted",
                      "hover:text-semantics-base-fg",
                      isActive && "text-semantics-base-fg-default"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
