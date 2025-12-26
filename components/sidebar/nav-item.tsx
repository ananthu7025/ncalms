"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isCollapsed?: boolean;
}

export function SidebarNavItem({ href, icon, title, isCollapsed }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
        isActive && "bg-sidebar-accent text-sidebar-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      {icon}
      {!isCollapsed && <span className="font-medium animate-in fade-in duration-300">{title}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
