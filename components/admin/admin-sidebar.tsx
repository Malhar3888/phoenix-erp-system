"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarCheck,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  MessageSquareText,
  Receipt,
  Settings,
  Wallet,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/fees", label: "Fees & Payments", icon: IndianRupee },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/expenses", label: "Expenses", icon: Wallet },
]

const reportsNav = [
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/receipts", label: "Receipts", icon: Receipt },
]

const systemNav = [{ href: "/settings", label: "Settings", icon: Settings }]

export function AdminSidebar() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-2 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-primary/30">
            <Image
              src="/phoenix-logo.png"
              alt="Phoenix Computers"
              fill
              sizes="36px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-wide text-foreground">
              PHOENIX
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
              Computers ERP
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportsNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:hidden">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-1 ring-primary/30">
            AD
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold text-foreground">
              Admin
            </span>
            <span className="truncate text-xs text-muted-foreground">
              admin@phoenix.in
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
