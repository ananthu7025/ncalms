"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { applyOfferCode } from "@/lib/actions/cart";

interface CouponInputProps {
  onApply: (offerData: {
    code: string;
    name: string;
    discount: number;
    offerId: string;
  }) => void;
  onRemove: () => void;
  appliedOffer?: {
    code: string;
    name: string;
    discount: number;
  } | null;
}

export function CouponInput({ onApply, onRemove, appliedOffer }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await applyOfferCode(code.trim());
      console.log(result)
      if (result.success && result.offer && result.discount !== undefined) {
        toast.success(result.message);
        onApply({
          code: result.offer.code,
          name: result.offer.name,
          discount: result.discount,
          offerId: result.offer.id,
        });
        setCode("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to apply coupon code");
      console.error("Apply coupon error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    toast.info("Coupon removed");
  };

  if (appliedOffer) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              {appliedOffer.name}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Code: {appliedOffer.code} • Save ${appliedOffer.discount.toFixed(2)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Have a coupon code?
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApply();
            }
          }}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            "Apply"
          )}
        </Button>
      </div>
    </div>
  );
}
