"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin } from "lucide-react";
import toaster from "@/lib/toaster";
import { updateBookingStatus } from "@/lib/actions/sessions";
import type { SessionType, SessionBooking } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

interface BookingWithDetails {
  booking: SessionBooking;
  user: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    roleId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  sessionType: SessionType | null;
}

interface BookingsTableProps {
  bookings: BookingWithDetails[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter();

  const handleStatusChange = async (bookingId: string, newStatus: string, notes?: string) => {
    try {
      const result = await updateBookingStatus({
        id: bookingId,
        status: newStatus as "pending" | "confirmed" | "completed" | "cancelled",
        notes,
      });

      if (result.success) {
        toaster.success(result.message || "Booking status updated");
        router.refresh();
      } else {
        toaster.error(result.error || "Failed to update booking status");
      }
    } catch (error) {
      toaster.error("An error occurred while updating");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      completed: "outline",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (booking: SessionBooking) => {
    if (booking.amountPaid && booking.status === "confirmed") {
      return <Badge variant="default">Paid ${booking.amountPaid}</Badge>;
    }
    if (booking.status === "pending") {
      return <Badge variant="secondary">Unpaid</Badge>;
    }
    return <Badge variant="outline">N/A</Badge>;
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No booking requests yet</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Details</TableHead>
            <TableHead>Session Type</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((item) => (
            <TableRow key={item.booking.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {item.booking.fullName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {item.booking.email}
                  </div>
                  {item.booking.gmail && (
                    <div className="text-xs text-muted-foreground">Gmail: {item.booking.gmail}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{item.sessionType?.title || "N/A"}</span>
              </TableCell>
              <TableCell>
                {item.booking.whatsapp && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {item.booking.whatsapp}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {(item.booking.province || item.booking.country) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {[item.booking.province, item.booking.country].filter(Boolean).join(", ")}
                  </div>
                )}
              </TableCell>
              <TableCell>{getPaymentBadge(item.booking)}</TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(item.booking.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>{getStatusBadge(item.booking.status)}</TableCell>
              <TableCell>
                <Select
                  value={item.booking.status}
                  onValueChange={(value) => handleStatusChange(item.booking.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
