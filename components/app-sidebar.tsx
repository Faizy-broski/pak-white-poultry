"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ClipboardListIcon, UsersIcon, LayersIcon } from "lucide-react"

function EggIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C7.5 2 4 11 4 15.5 4 19.6 7.6 22 12 22s8-2.4 8-6.5C20 11 16.5 2 12 2Z" />
    </svg>
  )
}

const user = {
  name: "Admin",
  email: "admin@pakwhitepoultry.pk",
  avatar: "/avatars/admin.jpg",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: <ClipboardListIcon />,
      isActive: pathname?.startsWith("/dashboard/orders"),
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: <UsersIcon />,
      isActive: pathname?.startsWith("/dashboard/customers"),
    },
    {
      title: "Plans",
      url: "/dashboard/plans",
      icon: <LayersIcon />,
      isActive: pathname?.startsWith("/dashboard/plans"),
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <EggIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-serif font-semibold">
                  Pak White Poultry
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Admin Panel
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}