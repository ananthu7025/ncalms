/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToCart } from "@/lib/actions/cart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function AutoEnrollHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const hasEnrolled = useRef(false);

  useEffect(() => {
    const autoEnroll = searchParams.get("autoEnroll");
    const subjectId = searchParams.get("subjectId");
    const contentTypeId = searchParams.get("contentTypeId");
    const isBundle = searchParams.get("isBundle") === "true";
    const price = parseFloat(searchParams.get("price") || "0");

    // Only enroll once - prevent duplicate calls
    if (autoEnroll === "true" && subjectId && !hasEnrolled.current) {
      hasEnrolled.current = true;
      handleAutoEnroll(subjectId, contentTypeId, isBundle, price);
    }
  }, [searchParams]);

  const handleAutoEnroll = async (
    subjectId: string,
    contentTypeId: string | null,
    isBundle: boolean,
    price: number
  ) => {
    setStatus("adding");

    try {
      const result = await addToCart(subjectId, contentTypeId, isBundle, price);

      if (result.success) {
        setStatus("success");

        // Clear the URL params and refresh after a short delay
        setTimeout(() => {
          // Remove query params by pushing to the same route without params
          router.replace("/learner/cart");
          router.refresh();
        }, 1500);
      } else {
        setStatus("error");
        setMessage(result.message || "Failed to add course to cart");

        // Clear params after showing error
        setTimeout(() => {
          router.replace("/learner/cart");
        }, 3000);
      }
    } catch (error) {
      console.error("Error during auto-enrollment:", error);
      setStatus("error");
      setMessage("An unexpected error occurred. Please try adding the course manually.");

      // Clear params after showing error
      setTimeout(() => {
        router.replace("/learner/cart");
      }, 3000);
    }
  };

  if (status === "idle") {
    return null;
  }

  return (
    <div className="mb-6">
      {status === "adding" && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription className="ml-2">{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
