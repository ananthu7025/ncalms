"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import toaster from "@/lib/toaster";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import InputText from "@/components/InputComponents/InputText";
import InputTextarea from "@/components/InputComponents/InputTextarea";
import InputSwitch from "@/components/InputComponents/InputSwitch";
import { createSessionType, updateSessionType } from "@/lib/actions/sessions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SessionType } from "@/lib/db/schema";

interface SessionDialogProps {
  session?: SessionType;
  onSessionSaved?: () => void;
}

const sessionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required"),
  isActive: z.boolean(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

export function SessionDialog({ session, onSessionSaved }: SessionDialogProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!session;

  const hookForm = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "30",
      price: "0",
      isActive: true,
    },
  });

  // Reset form when session changes or dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      if (session) {
        hookForm.reset({
          title: session.title,
          description: session.description || "",
          duration: session.duration.toString(),
          price: session.price,
          isActive: session.isActive,
        });
      } else {
        hookForm.reset({
          title: "",
          description: "",
          duration: "30",
          price: "0",
          isActive: true,
        });
      }
    }
  }, [isDialogOpen, session, hookForm]);

  const onSubmit = async (data: SessionFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        title: data.title,
        description: data.description,
        duration: parseInt(data.duration),
        price: data.price,
        isActive: data.isActive,
      };

      let result;
      if (isEditMode && session) {
        result = await updateSessionType({
          id: session.id,
          ...payload,
        });
      } else {
        result = await createSessionType(payload);
      }

      if (result.success) {
        toaster.success(
          result.message || `Session type ${isEditMode ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        hookForm.reset();
        if (onSessionSaved) {
          onSessionSaved();
        } else {
          router.refresh();
        }
      } else {
        toaster.error(result.error || `Failed to ${isEditMode ? "update" : "create"} session type`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toaster.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Session Type
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Session Type" : "Add New Session Type"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={hookForm.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Title */}
          <InputText
            hookForm={hookForm}
            field="title"
            label="Session Title"
            labelMandatory
            placeholder="e.g., Career Counseling"
          />

          {/* Description */}
          <InputTextarea
            hookForm={hookForm}
            field="description"
            label="Description"
            placeholder="Describe what this session covers"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <InputText
              hookForm={hookForm}
              field="duration"
              label="Duration (minutes)"
              labelMandatory
              placeholder="30"
              type="number"
            />

            {/* Price */}
            <InputText
              hookForm={hookForm}
              field="price"
              label="Price (CAD)"
              labelMandatory
              placeholder="0.00"
              type="number"
              step="0.01"
            />
          </div>

          {/* Is Active */}
          <InputSwitch
            hookForm={hookForm}
            field="isActive"
            label="Active"
            description="Inactive session types cannot be booked"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{isEditMode ? "Update Session Type" : "Add Session Type"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
