"use client";

import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserFooterProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  isCollapsed?: boolean;
}

export function UserFooter({ user, isCollapsed }: UserFooterProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";
  const displayName = user?.name || "Guest";
  const displayEmail = user?.email || "";

  const profilePath = user?.role === "ADMIN" ? "/admin/profile" : "/learner/profile";
  const settingsPath = user?.role === "ADMIN" ? "/admin/settings" : "/learner/settings";

  return (
    <div className={cn("p-3 border-t border-sidebar-border", isCollapsed && "justify-center flex")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50",
            isCollapsed ? "w-auto justify-center" : "w-full"
          )}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.image || undefined} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-sidebar-muted truncate">
                    {displayEmail}
                  </p>
                </div>
                <ChevronUp className="w-4 h-4 text-sidebar-muted" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="end"
          className="w-56 mb-2"
          sideOffset={5}
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => router.push(profilePath)}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(settingsPath)}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
