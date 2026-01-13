"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { addAllSubjectsToCart } from "@/lib/actions/cart";
import { toast } from "react-toastify";

/**
 * Inner component that uses useSearchParams
 * Checks for ?purchaseAll=true URL parameter
 */
function PurchaseAllHandlerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    const purchaseAll = searchParams.get("purchaseAll");

    console.log("PurchaseAllHandler - purchaseAll:", purchaseAll, "status:", status, "hasProcessed:", hasProcessedRef.current);

    // Only process if:
    // 1. purchaseAll parameter is present
    // 2. User is authenticated
    // 3. Haven't processed yet (prevent double execution)
    if (purchaseAll === "true" && status === "authenticated" && !hasProcessedRef.current) {
      hasProcessedRef.current = true;

      console.log("PurchaseAllHandler - Starting purchase...");

      const executePurchase = async () => {
        try {
          const result = await addAllSubjectsToCart();

          console.log("PurchaseAllHandler - Result:", result);

          if (result.success) {
            toast.success(result.message);
            // Redirect to cart, removing the purchaseAll parameter
            router.push("/learner/cart");
          } else {
            toast.error(result.message);
            // Remove the parameter even on failure
            router.replace("/");
          }
        } catch (error) {
          console.error("Error adding all subjects to cart:", error);
          toast.error("Failed to add subjects to cart");
          router.replace("/");
        }
      };

      executePurchase();
    }
  }, [searchParams, status, router]);

  return null;
}

/**
 * Wrapper component with Suspense boundary
 */
export default function PurchaseAllHandler() {
  return (
    <PurchaseAllHandlerInner />
  );
}
