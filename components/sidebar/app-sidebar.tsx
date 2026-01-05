"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./nav-item";
import { UserFooter } from "./user-footer";
import { learnerNavItems, adminNavItems } from "./config";
import { Button } from "@/components/ui/button";
import { getCartItemCount } from "@/lib/actions/cart";

interface AppSidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
    };
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isMobile: boolean;
}

export function AppSidebar({ user, isCollapsed, toggleSidebar, isMobile }: AppSidebarProps) {
    const userRole = user?.role;
    const [cartCount, setCartCount] = useState<number>(0);

    useEffect(() => {
        // Only fetch cart count for learners
        if (userRole === "USER") {
            const fetchCartCount = async () => {
                try {
                    const count = await getCartItemCount();
                    setCartCount(count);
                } catch (error) {
                    console.error("Failed to fetch cart count:", error);
                }
            };

            fetchCartCount();

            // Refresh cart count every 10 seconds
            const interval = setInterval(fetchCartCount, 10000);

            // Also refresh when page becomes visible
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    fetchCartCount();
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                clearInterval(interval);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [userRole]);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col border-r border-sidebar-border",
                isCollapsed ? "w-[70px]" : "w-64"
            )}
        >
            <div className={cn("flex items-center transition-all duration-300",
                isCollapsed ? "flex-col justify-center h-24 gap-2 pt-4" : "justify-between p-4 h-16"
            )}>
                <Link href="/" className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-sidebar-foreground animate-in fade-in duration-300">
                            NCA
                        </span>
                    )}
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className={cn("h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground", isCollapsed ? "mt-2" : "")}
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                {userRole === "USER" && (
                    <>
                        {!isCollapsed && (
                            <p className="px-3 text-xs font-semibold text-sidebar-muted uppercase tracking-wider mb-2 animate-in fade-in">
                                Learning
                            </p>
                        )}
                        {learnerNavItems.map((item) => (
                            <SidebarNavItem
                                key={item.href}
                                href={item.href}
                                title={item.title}
                                icon={<item.icon className="w-5 h-5" />}
                                isCollapsed={isCollapsed}
                                badge={item.href === "/learner/cart" ? cartCount : undefined}
                            />
                        ))}
                    </>
                )}

                {userRole === "ADMIN" && (
                    <>
                        {!isCollapsed && (
                            <p className="px-3 text-xs font-semibold text-sidebar-muted uppercase tracking-wider mb-2 animate-in fade-in">
                                Administration
                            </p>
                        )}
                        {adminNavItems.map((item) => (
                            <SidebarNavItem
                                key={item.href}
                                href={item.href}
                                title={item.title}
                                icon={<item.icon className="w-5 h-5" />}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </>
                )}
            </nav>

            {/* Dynamic User Footer */}
            <UserFooter user={user} isCollapsed={isCollapsed} />
        </aside>
    );
}
