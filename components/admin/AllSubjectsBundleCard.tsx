"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Package, X } from "lucide-react";
import { updateAllSubjectsBundle } from "@/lib/actions/platform-settings";
import toaster from "@/lib/toaster";
import { useRouter } from "next/navigation";

interface AllSubjectsBundleModalProps {
  initialEnabled: boolean;
  initialPrice: string;
}

// Set the app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

export function AllSubjectsBundleModal({
  initialEnabled,
  initialPrice,
}: AllSubjectsBundleModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [price, setPrice] = useState(initialPrice || "0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsEnabled(initialEnabled);
      setPrice(initialPrice || "0");
    }
  }, [isOpen, initialEnabled, initialPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateAllSubjectsBundle({
        allSubjectsBundleEnabled: isEnabled,
        allSubjectsBundlePrice: price,
      });

      if (result.success) {
        toaster.success(result.message || "Bundle settings updated successfully");
        router.refresh();
        setIsOpen(false);
      } else {
        toaster.error(result.error || "Failed to update bundle settings");
      }
    } catch (error) {
      toaster.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      position: "relative" as const,
      top: "auto",
      left: "auto",
      right: "auto",
      bottom: "auto",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "90vh",
      overflow: "auto",
      border: "none",
      borderRadius: "12px",
      padding: "0",
      background: "hsl(var(--card))",
    },
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
        <Package className="mr-2 h-4 w-4" />
        Mandatory Subjects Bundle
      </Button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => !isSubmitting && setIsOpen(false)}
        style={customStyles}
        contentLabel="Mandatory Subjects Bundle Configuration"
        shouldCloseOnOverlayClick={!isSubmitting}
      >
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Mandatory Subjects Bundle</h2>
                <p className="text-sm text-muted-foreground">
                  Configure pricing for purchasing all mandatory subjects
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex items-center justify-between space-x-4 rounded-lg border border-border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="bundle-enabled" className="text-base font-medium">
                  Enable Mandatory Bundle
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to purchase all mandatory subjects in a single bundle
                </p>
              </div>
              <Switch
                id="bundle-enabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bundle-price">Bundle Price ($)</Label>
              <Input
                id="bundle-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isSubmitting || !isEnabled}
                placeholder="0.00"
              />
              <p className="text-sm text-muted-foreground">
                Set the total price for purchasing all mandatory subjects
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
