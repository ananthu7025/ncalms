"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/actions/cart";
import Image from "next/image";

interface AddToCartButtonProps {
  subjectId: string;
  contentTypeId: string | null;
  isBundle: boolean;
  price: number;
  buttonText?: string;
  className?: string;
  variant?: "primary" | "outline";
  size?: "default" | "lg";
}

export function AddToCartButton({
  subjectId,
  contentTypeId,
  isBundle,
  price,
  buttonText = "Add to Cart",
  className = "",
  variant = "primary",
  size = "default",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (isAdded) {
      router.push("/learner/cart");
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCart(subjectId, contentTypeId, isBundle, price);

      if (result.success) {
        setIsAdded(true);
        // Optionally show a toast notification here
      } else {
        // If unauthorized, redirect to login with course details
        if (result.message === "Unauthorized") {
          // Create URL with enrollment details
          const params = new URLSearchParams({
            enrollCourse: subjectId,
            ...(contentTypeId && { contentType: contentTypeId }),
            isBundle: isBundle.toString(),
            price: price.toString(),
            callbackUrl: "/learner/cart"
          });
          router.push(`/login?${params.toString()}`);
        } else {
          // If already in cart, mark as added
          if (result.message.includes("already")) {
            setIsAdded(true);
          }
          alert(result.message);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const baseStyles = size === "lg"
    ? "inline-flex h-[60px] items-center justify-center gap-x-2 rounded-[50px] px-8 text-lg font-semibold transition-all hover:shadow-lg"
    : "inline-flex h-[50px] items-center justify-center gap-x-2 rounded-[50px] px-6 text-base font-semibold transition-all hover:shadow-md";

  const variantStyles = variant === "primary"
    ? "bg-colorPurpleBlue text-white hover:bg-colorPurpleBlue/90"
    : "border-2 border-colorPurpleBlue bg-white text-colorPurpleBlue hover:bg-colorPurpleBlue hover:text-white";

  const disabledStyles = (isAdding || isAdded) ? "opacity-70 cursor-not-allowed" : "";

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || price <= 0}
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
    >
      {isAdding ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span>Adding...</span>
        </>
      ) : isAdded ? (
        <>
          <Image
            src="/assets/img/icons/icon-white-arrow-right.svg"
            alt="Go to cart"
            width={20}
            height={20}
          />
          <span>View Cart</span>
        </>
      ) : (
        <>
          <Image
            src="/assets/img/icons/icon-white-bag.svg"
            alt="Add to cart"
            width={20}
            height={20}
          />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
}
