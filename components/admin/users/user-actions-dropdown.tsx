"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Mail, UserX, UserCheck } from "lucide-react";
import { toggleUserStatus } from "@/lib/actions/users";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UserActionsDropdownProps {
  userId: string;
  userName: string;
  userEmail: string;
  isActive: boolean;
}

export function UserActionsDropdown({
  userId,
  userName,
  userEmail,
  isActive,
}: UserActionsDropdownProps) {
  const router = useRouter();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      await toggleUserStatus(userId);
      toast.success(
        `User ${isActive ? "deactivated" : "activated"} successfully`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowStatusDialog(false);
    }
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${userEmail}`;
  };



  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isLoading}>
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowStatusDialog(true)}
            className={isActive ? "text-destructive" : "text-green-600"}
          >
            {isActive ? (
              <>
                <UserX className="w-4 h-4 mr-2" />
                Deactivate User
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Activate User
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? "Deactivate" : "Activate"} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {isActive ? "deactivate" : "activate"}{" "}
              {userName}? {isActive && "They will not be able to access their account."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={isLoading}
              className={isActive ? "bg-destructive" : ""}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
