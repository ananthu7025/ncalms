"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Check, X, Trash } from "lucide-react";
import { addToCart, removeFromCartByItem } from "@/lib/actions/cart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  subjectId: string;
  contentTypeId: string | null;
  isBundle: boolean;
  price: number;
  buttonText?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  fullWidth?: boolean;
  showIcon?: boolean;
}

export function AddToCartButton({
  subjectId,
  contentTypeId,
  isBundle,
  price,
  buttonText,
  variant = "default",
  size = "default",
  className = "",
  fullWidth = false,
  showIcon = true,
  initialIsAdded = false,
}: AddToCartButtonProps & { initialIsAdded?: boolean }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdded, setIsAdded] = useState(initialIsAdded);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (isAdded) return;

    setIsAdding(true);
    try {
      const result = await addToCart(subjectId, contentTypeId, isBundle, price);

      if (result.success) {
        setIsAdded(true);
        toast.success(result.message);

        // Refresh to update cart count if needed
        router.refresh();
      } else {
        toast.error(result.message);
        // If item is already in cart, mark as added
        if (result.message.includes("already in cart")) {
          setIsAdded(true);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!isAdded) return;

    setIsRemoving(true);
    try {
      const result = await removeFromCartByItem(subjectId, contentTypeId, isBundle);

      if (result.success) {
        setIsAdded(false);
        toast.success(result.message);

        // Refresh to update cart count
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    } finally {
      setIsRemoving(false);
    }
  };

  const defaultButtonText = isBundle
    ? "Add Complete Bundle"
    : "Add";

  // Check if price is invalid (0, null, undefined, or NaN)
  const isPriceInvalid = !price || price === 0 || Number.isNaN(price);

  return (
    <Button
      variant={isAdded ? "destructive" : variant}
      size={size}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
      onClick={isAdded ? handleRemoveFromCart : handleAddToCart}
      disabled={isAdding || isRemoving || isPriceInvalid}
    >
      {isAdding ? (
        <>
          <Loader2 className={`${showIcon ? (size === "sm" ? "w-3 h-3 mr-1" : "w-5 h-5 mr-2") : "w-4 h-4"} animate-spin`} />
          {showIcon && "Adding..."}
        </>
      ) : isRemoving ? (
        <>
          <Loader2 className={`${showIcon ? (size === "sm" ? "w-3 h-3 mr-1" : "w-5 h-5 mr-2") : "w-4 h-4"} animate-spin`} />
          {showIcon && "Removing..."}
        </>
      ) : isAdded ? (
        <>
          <Trash className={`${showIcon ? (size === "sm" ? "w-3 h-3 mr-1" : "w-5 h-5 mr-2") : "w-4 h-4"}`} />
          {showIcon && ""}
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className={size === "sm" ? "w-3 h-3 mr-1" : "w-5 h-5 mr-2"} />}
          {buttonText || defaultButtonText}
        </>
      )}
    </Button>
  );
}
