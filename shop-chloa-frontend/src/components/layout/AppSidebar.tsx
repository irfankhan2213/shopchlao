"use client";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Archive,
  Receipt,
  AlertCircle,
  Users,
  FileText,
  Settings,
  Store,
  ChevronLeft,
  Menu,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    color: "text-primary",
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    color: "text-secondary",
  },
  {
    title: "Categories & Brands",
    url: "/categories",
    icon: Tags,
    color: "text-accent-foreground",
  },
  {
    title: "Stock Tracker",
    url: "/stock",
    icon: Archive,
    color: "text-primary",
  },
  {
    title: "Sales Record",
    url: "/sales",
    icon: Receipt,
    color: "text-secondary",
  },
  {
    title: "Expiry & Alerts",
    url: "/alerts",
    icon: AlertCircle,
    color: "text-warning",
  },
  {
    title: "Customer Book",
    url: "/customers",
    icon: Users,
    color: "text-accent-foreground",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    color: "text-primary",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    color: "text-muted-foreground",
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const currentPath = usePathname();

  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath ? currentPath.startsWith(path) : false;
  };

  const getNavClassName = (path: string) => {
    const baseClasses =
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200";

    if (isActive(path)) {
      return `${baseClasses} bg-primary text-primary-foreground shadow-md`;
    }

    return `${baseClasses} text-muted-foreground hover:bg-accent hover:text-accent-foreground`;
  };

  return (
    <Sidebar
      className={cn(
        `border-r border-border/50 transition-all duration-300`,
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
                Shop Chlao
              </h1>
              <p className="text-xs text-muted-foreground">Inventory Manager</p>
            </div>
          </div>
        )}
        {collapsed && <Store className="h-8 w-8 text-primary mx-auto" />}
      </div>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
              MAIN MENU
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={getNavClassName(item.url)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon
                        className={`h-5 w-5 ${item.color} flex-shrink-0`}
                      />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
