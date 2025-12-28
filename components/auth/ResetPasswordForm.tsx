"use client";

import { z } from "zod";
import Link from "next/link";
import toaster from "@/lib/toaster";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import InputText from "@/components/InputComponents/InputText";

// Form validation schema
const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize react-hook-form
  const hookForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toaster.error("Invalid or missing reset token");
    }
  }, [token]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toaster.error("Missing reset token");
      return;
    }

    startTransition(() => {
      resetPassword(token, data.password)
        .then((result) => {
          if (result.success) {
            setIsSuccess(true);
            toaster.success(result.message as string);
            setTimeout(() => {
              router.push("/login");
            }, 3000);
          } else {
            toaster.error(result.error as string);
          }
        })
        .catch(() => toaster.error("Something went wrong"));
    });
  };

  if (!token) {
    return (
      <div>
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Missing Token
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Please use the link sent to your email address.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Set New Password</h2>
        <p className="text-muted-foreground">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={hookForm.handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password with toggle visibility */}
          <div className="space-y-2">
            <InputText
              hookForm={hookForm}
              field="password"
              label="New Password"
              labelMandatory
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-3 top-9 h-8 px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          {/* Confirm Password with toggle visibility */}
          <div className="space-y-2 relative">
            <InputText
              hookForm={hookForm}
              field="confirmPassword"
              label="Confirm Password"
              labelMandatory
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-3 top-9 h-8 px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          <Button
            className="w-full bg-[#1a56db] hover:bg-[#1546b3]"
            size="lg"
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Reset Password
          </Button>
        </form>
      ) : (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Password reset successful
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your password has been updated. You will be redirected to the
                  login page shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign in
        </Link>
      </div>
    </div>
  );
}
