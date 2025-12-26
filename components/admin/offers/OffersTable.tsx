"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Trash2 } from "lucide-react";
import { deleteOffer, toggleOfferStatus } from "@/lib/actions/offers";
import { OfferDialog } from "./OfferDialog";
import toaster from "@/lib/toaster";
import { useRouter } from "next/navigation";

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
  currentUsage: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

interface OfferWithRelations {
  offer: Offer;
  subject: Subject | null;
  contentType: ContentType | null;
}

interface OffersTableProps {
  offers: OfferWithRelations[];
  subjects: Subject[];
  contentTypes: ContentType[];
}

export function OffersTable({ offers, subjects, contentTypes }: OffersTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteOffer(id);
      if (result.success) {
        toaster.success(result.message || "Offer deleted successfully");
        router.refresh();
      } else {
        toaster.error(result.error || "Failed to delete offer");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toaster.error("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    setTogglingId(id);
    try {
      const result = await toggleOfferStatus(id);
      if (result.success) {
        toaster.success(result.message || "Offer status updated");
        router.refresh();
      } else {
        toaster.error(result.error || "Failed to update offer status");
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      toaster.error("An unexpected error occurred");
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDiscount = (type: string, value: string) => {
    if (type === "percentage") {
      return `${value}%`;
    }
    return `$${value}`;
  };

  const isExpiringSoon = (validUntil: Date) => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const until = new Date(validUntil);
    return until > now && until <= sevenDaysFromNow;
  };

  const isExpired = (validUntil: Date) => {
    return new Date(validUntil) < new Date();
  };

  if (offers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No offers found. Create your first offer to get started.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Applies To</TableHead>
            <TableHead>Validity</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map(({ offer, subject, contentType }) => {
            const expired = isExpired(offer.validUntil);
            const expiringSoon = isExpiringSoon(offer.validUntil);

            return (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">{offer.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{offer.code}</Badge>
                </TableCell>
                <TableCell>
                  {formatDiscount(offer.discountType, offer.discountValue)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{subject ? subject.title : "All Courses"}</p>
                    <p className="text-muted-foreground text-xs">
                      {contentType ? contentType.name : "All Bundles"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <span>{formatDate(offer.validFrom)}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{formatDate(offer.validUntil)}</span>
                    </div>
                    {expired && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Expired
                      </Badge>
                    )}
                    {!expired && expiringSoon && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {offer.currentUsage} / {offer.maxUsage || "∞"}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={offer.isActive}
                    onCheckedChange={() => handleToggleStatus(offer.id)}
                    disabled={togglingId === offer.id}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <OfferDialog
                      subjects={subjects}
                      contentTypes={contentTypes}
                      offer={offer}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(offer.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this offer. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
