"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: any;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsCollapsed(true);
            } else {
                // Optional: Auto-expand on large screens
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-background flex">
                {/* Default loading state - assumes desktop mostly */}
                <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border hidden lg:block" />
                <main className="transition-all duration-300 min-h-screen w-full ml-0 lg:ml-64">
                    <div className="p-6 lg:p-8">{children}</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            <AppSidebar
                user={user}
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            <main
                className={cn(
                    "transition-all duration-300 min-h-screen w-full",
                    isCollapsed ? "ml-[70px]" : "ml-64"
                )}
            >
                <div className="p-4 md:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
