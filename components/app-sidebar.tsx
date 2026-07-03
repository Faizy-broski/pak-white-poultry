"use client"

import * as React from "react"

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
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  UsersIcon,
  TruckIcon,
  PackageIcon,
  BarChart3Icon,
  Settings2Icon,
} from "lucide-react"

function EggIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C7.5 2 4 11 4 15.5 4 19.6 7.6 22 12 22s8-2.4 8-6.5C20 11 16.5 2 12 2Z" />
    </svg>
  )
}

// Pak White Poultry admin navigation
const data = {
  user: {
    name: "Admin",
    email: "admin@pakwhitepoultry.pk",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard/analytics" },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: <ClipboardListIcon />,
      items: [
        { title: "All Orders", url: "/dashboard/orders" },
        { title: "Pending", url: "/dashboard/orders?status=pending" },
        { title: "Delivered", url: "/dashboard/orders?status=delivered" },
      ],
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: <UsersIcon />,
      items: [
        { title: "All Customers", url: "/dashboard/customers" },
        { title: "New Signups", url: "/dashboard/customers?filter=new" },
      ],
    },
    {
      title: "Delivery",
      url: "/dashboard/delivery",
      icon: <TruckIcon />,
      items: [
        { title: "Routes", url: "/dashboard/delivery/routes" },
        { title: "Riders", url: "/dashboard/delivery/riders" },
      ],
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: <PackageIcon />,
      items: [
        { title: "Egg Stock", url: "/dashboard/inventory" },
        { title: "Farms", url: "/dashboard/inventory/farms" },
      ],
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: <BarChart3Icon />,
      items: [
        { title: "Sales", url: "/dashboard/reports/sales" },
        { title: "Deliveries", url: "/dashboard/reports/deliveries" },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2Icon />,
      items: [
        { title: "General", url: "/dashboard/settings" },
        { title: "Pricing", url: "/dashboard/settings/pricing" },
        { title: "Team", url: "/dashboard/settings/team" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}