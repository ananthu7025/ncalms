"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CouponInput } from "@/components/learner/coupon-input";
import { CheckoutButton } from "@/components/learner/checkout-button";

interface CartSummaryProps {
  initialSubtotal: number;
}

export function CartSummary({ initialSubtotal }: CartSummaryProps) {
  const [appliedOffer, setAppliedOffer] = useState<{
    code: string;
    name: string;
    discount: number;
    offerId: string;
  } | null>(null);

  const subtotal = initialSubtotal;
  const discount = appliedOffer?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyOffer = (offerData: {
    code: string;
    name: string;
    discount: number;
    offerId: string;
  }) => {
    setAppliedOffer(offerData);
  };

  const handleRemoveOffer = () => {
    setAppliedOffer(null);
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)} CAD</span>
        </div>

        {/* Discount (if applied) */}
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 dark:text-green-400">
              Discount
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              -${discount.toFixed(2)} CAD
            </span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">
            ${total.toFixed(2)} CAD
          </span>
        </div>

        {/* Savings badge */}
        {discount > 0 && (
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              You save ${discount.toFixed(2)}!
            </p>
          </div>
        )}

        <Separator />

        {/* Coupon Input */}
        <CouponInput
          onApply={handleApplyOffer}
          onRemove={handleRemoveOffer}
          appliedOffer={appliedOffer}
        />

        <Separator />

        {/* Checkout Button */}
        <CheckoutButton appliedOffer={appliedOffer} />

        <p className="text-xs text-center text-muted-foreground">
          Secure checkout powered by Stripe
        </p>
      </CardContent>
    </Card>
  );
}
