"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, ExternalLink } from "lucide-react";
import type { Transaction } from "@/lib/actions/transactions";
import { format } from "date-fns";
import toaster from "@/lib/toaster";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toaster.success(`${label} copied to clipboard`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction ID and Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {transaction.id}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(transaction.id, "Transaction ID")}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Badge variant={getStatusColor(transaction.status)} className="capitalize">
              {transaction.status}
            </Badge>
          </div>

          <Separator />

          {/* User Information */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm col-span-2">{transaction.userName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm col-span-2">{transaction.userEmail}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Purchase Information */}
          <div>
            <h3 className="font-semibold mb-3">Purchase Details</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Subject:</span>
                <span className="text-sm col-span-2 font-medium">
                  {transaction.subjectTitle}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="text-sm col-span-2">
                  {transaction.isBundle ? (
                    <Badge variant="secondary">Complete Bundle</Badge>
                  ) : (
                    <Badge variant="outline">
                      {transaction.contentTypeName || "Individual"}
                    </Badge>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-sm col-span-2 font-bold text-lg">
                  ${parseFloat(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm col-span-2">
                  {format(new Date(transaction.createdAt), "PPpp")}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {(transaction.stripeSessionId || transaction.stripePaymentIntentId) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Payment Information</h3>
                <div className="space-y-2">
                  {transaction.stripeSessionId && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-muted-foreground">Session ID:</span>
                      <div className="col-span-2 flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
                          {transaction.stripeSessionId}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            copyToClipboard(
                              transaction.stripeSessionId!,
                              "Stripe Session ID"
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {transaction.stripePaymentIntentId && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-muted-foreground">Payment Intent:</span>
                      <div className="col-span-2 flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
                          {transaction.stripePaymentIntentId}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            copyToClipboard(
                              transaction.stripePaymentIntentId!,
                              "Payment Intent ID"
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            window.open(
                              `https://dashboard.stripe.com/payments/${transaction.stripePaymentIntentId}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
