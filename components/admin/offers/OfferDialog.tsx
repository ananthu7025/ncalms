"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import toaster from "@/lib/toaster";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import InputText from "@/components/InputComponents/InputText";
import InputSelect from "@/components/InputComponents/InputSelect";
import InputSwitch from "@/components/InputComponents/InputSwitch";
import { createOffer, updateOffer } from "@/lib/actions/offers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Subject {
  id: string;
  title: string;
}

interface ContentType {
  id: string;
  name: string;
}

interface Offer {
  id: string;
  name: string;
  code: string;
  discountType: string;
  discountValue: string;
  subjectId: string | null;
  contentTypeId: string | null;
  maxUsage: number | null;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

interface OfferDialogProps {
  subjects: Subject[];
  contentTypes: ContentType[];
  offer?: Offer;
  onOfferSaved?: () => void;
}

const offerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(3, "Code must be at least 3 characters"),
  discountType: z.string().min(1, "Discount type is required"),
  discountValue: z.string().min(1, "Discount value is required"),
  subjectId: z.string().optional(),
  contentTypeId: z.string().optional(),
  maxUsage: z.string().optional(),
  validFrom: z.string().min(1, "Valid from date is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  isActive: z.boolean(),
});

type OfferFormData = z.infer<typeof offerSchema>;

export function OfferDialog({
  subjects,
  contentTypes,
  offer,
  onOfferSaved,
}: OfferDialogProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!offer;

  const hookForm = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: "",
      subjectId: "__all__",
      contentTypeId: "__all__",
      maxUsage: "",
      validFrom: "",
      validUntil: "",
      isActive: true,
    },
  });

  // Reset form when offer changes or dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      if (offer) {
        hookForm.reset({
          name: offer.name,
          code: offer.code,
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          subjectId: offer.subjectId || "__all__",
          contentTypeId: offer.contentTypeId || "__all__",
          maxUsage: offer.maxUsage?.toString() || "",
          validFrom: new Date(offer.validFrom).toISOString().slice(0, 16),
          validUntil: new Date(offer.validUntil).toISOString().slice(0, 16),
          isActive: offer.isActive,
        });
      } else {
        hookForm.reset({
          name: "",
          code: "",
          discountType: "percentage",
          discountValue: "",
          subjectId: "__all__",
          contentTypeId: "__all__",
          maxUsage: "",
          validFrom: "",
          validUntil: "",
          isActive: true,
        });
      }
    }
  }, [isDialogOpen, offer, hookForm]);

  const onSubmit = async (data: OfferFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name,
        code: data.code.toUpperCase(),
        discountType: data.discountType as "percentage" | "fixed",
        discountValue: data.discountValue,
        subjectId: data.subjectId && data.subjectId !== "__all__" ? data.subjectId : null,
        contentTypeId: data.contentTypeId && data.contentTypeId !== "__all__" ? data.contentTypeId : null,
        maxUsage: data.maxUsage ? parseInt(data.maxUsage) : null,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        isActive: data.isActive,
      };

      let result;
      if (isEditMode && offer) {
        result = await updateOffer({
          id: offer.id,
          ...payload,
        });
      } else {
        result = await createOffer(payload);
      }

      if (result.success) {
        toaster.success(result.message || `Offer ${isEditMode ? "updated" : "created"} successfully`);
        setIsDialogOpen(false);
        hookForm.reset();
        if (onOfferSaved) {
          onOfferSaved();
        } else {
          router.refresh();
        }
      } else {
        toaster.error(result.error || `Failed to ${isEditMode ? "update" : "create"} offer`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toaster.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed Amount ($)" },
  ];

  const subjectOptions = [
    { value: "__all__", label: "All Courses" },
    ...subjects.map((s) => ({ value: s.id, label: s.title })),
  ];

  const contentTypeOptions = [
    { value: "__all__", label: "All Bundles" },
    ...contentTypes.map((ct) => ({ value: ct.id, label: ct.name })),
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="ghost" size="sm">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Offer" : "Create New Offer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={hookForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Offer Name</Label>
              <InputText
                hookForm={hookForm}
                field="name"
                label=""
                placeholder="New Year Sale"
              />
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Offer Code</Label>
              <InputText
                hookForm={hookForm}
                field="code"
                label=""
                placeholder="NEWYEAR25"
              />
              <p className="text-xs text-muted-foreground">
                Code will be automatically converted to uppercase
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <InputSelect
                hookForm={hookForm}
                field="discountType"
                label=""
                options={discountTypeOptions}
              />
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <InputText
                hookForm={hookForm}
                field="discountValue"
                label=""
                placeholder="25"
                type="number"
              />
              <p className="text-xs text-muted-foreground">
                {hookForm.watch("discountType") === "percentage"
                  ? "Enter percentage (0-100)"
                  : "Enter fixed amount in dollars"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subjectId">Applies to Course</Label>
              <InputSelect
                hookForm={hookForm}
                field="subjectId"
                label=""
                options={subjectOptions}
              />
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="contentTypeId">Applies to Bundle</Label>
              <InputSelect
                hookForm={hookForm}
                field="contentTypeId"
                label=""
                options={contentTypeOptions}
              />
            </div>
          </div>

          {/* Max Usage */}
          <div className="space-y-2">
            <Label htmlFor="maxUsage">Maximum Usage (optional)</Label>
            <InputText
              hookForm={hookForm}
              field="maxUsage"
              label=""
              placeholder="100"
              type="number"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for unlimited usage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Valid From */}
            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                type="datetime-local"
                {...hookForm.register("validFrom")}
                className={hookForm.formState.errors.validFrom ? "border-destructive" : ""}
              />
              {hookForm.formState.errors.validFrom && (
                <p className="text-xs text-destructive">
                  {hookForm.formState.errors.validFrom.message}
                </p>
              )}
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                type="datetime-local"
                {...hookForm.register("validUntil")}
                className={hookForm.formState.errors.validUntil ? "border-destructive" : ""}
              />
              {hookForm.formState.errors.validUntil && (
                <p className="text-xs text-destructive">
                  {hookForm.formState.errors.validUntil.message}
                </p>
              )}
            </div>
          </div>

          {/* Is Active */}
          <div className="space-y-2">
            <InputSwitch
              hookForm={hookForm}
              field="isActive"
              label="Active"
              description="Inactive offers cannot be used by customers"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gradient-primary">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update Offer" : "Create Offer"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
