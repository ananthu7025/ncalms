"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Trash2 } from "lucide-react";
import toaster from "@/lib/toaster";
import { deleteSessionType, toggleSessionTypeStatus } from "@/lib/actions/sessions";
import { SessionDialog } from "./SessionDialog";
import type { SessionType } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface SessionTypesTableProps {
  sessionTypes: SessionType[];
}

export function SessionTypesTable({ sessionTypes }: SessionTypesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session type?")) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteSessionType(id);

      if (result.success) {
        toaster.success(result.message || "Session type deleted");
        router.refresh();
      } else {
        toaster.error(result.error || "Failed to delete session type");
      }
    } catch (error) {
      toaster.error("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const result = await toggleSessionTypeStatus(id);

      if (result.success) {
        toaster.success(result.message || "Status updated");
        router.refresh();
      } else {
        toaster.error(result.error || "Failed to toggle status");
      }
    } catch (error) {
      toaster.error("An error occurred");
    }
  };

  if (sessionTypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No session types configured yet. Click &quot;Add Session Type&quot; to create one.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {sessionTypes.map((session) => (
        <Card key={session.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-foreground">{session.title}</h3>
                  <Badge
                    variant={session.isActive ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleStatus(session.id)}
                  >
                    {session.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {session.description && (
                  <p className="text-muted-foreground mt-1">{session.description}</p>
                )}
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <DollarSign className="h-4 w-4" />
                    <span>{session.price} CAD</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <SessionDialog session={session} />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteSession(session.id)}
                  disabled={deletingId === session.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
