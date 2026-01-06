"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser, loginUser } from "@/lib/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InputText from "@/components/InputComponents/InputText";

// Form validation schema
const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is trying to enroll in a course
  const enrollCourse = searchParams.get("enrollCourse");
  const contentType = searchParams.get("contentType");
  const isBundle = searchParams.get("isBundle") === "true";
  const price = parseFloat(searchParams.get("price") || "0");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form
  const hookForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: RegisterFormData) => {
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        setSuccess(true);
        if (enrollCourse) {
          try {
            const loginResult = await loginUser(data.email, data.password);
            if (loginResult.success) {
              const enrollParams = new URLSearchParams({
                autoEnroll: "true",
                subjectId: enrollCourse,
                ...(contentType && { contentTypeId: contentType }),
                isBundle: isBundle.toString(),
                price: price.toString(),
              });

              setTimeout(() => {
                window.location.href = `/learner/cart?${enrollParams.toString()}`;
              }, 1000);
            } else {
              setTimeout(() => {
                router.push(
                  `/login?enrollCourse=${enrollCourse}&contentType=${
                    contentType || ""
                  }&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`
                );
              }, 2000);
            }
          } catch (enrollError) {
            console.error("Error during enrollment:", enrollError);
            setTimeout(() => {
              router.push(
                `/login?enrollCourse=${enrollCourse}&contentType=${
                  contentType || ""
                }&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`
              );
            }, 2000);
          }
        } else {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
        <p className="text-muted-foreground">
          {enrollCourse
            ? "Create an account to enroll in this course."
            : "Join our learning platform today"}
        </p>
      </div>

      {enrollCourse && (
        <Alert>
          <AlertDescription>
            After creating your account, the course will be added to your cart
            automatically.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            {enrollCourse
              ? "Account created successfully! Adding course to cart..."
              : "Account created successfully! Redirecting to login..."}
          </AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={hookForm.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <InputText
          hookForm={hookForm}
          field="name"
          label="Full Name"
          labelMandatory
          placeholder="Enter your full name"
          disabled={isLoading}
          autoComplete="name"
        />
        <InputText
          hookForm={hookForm}
          field="email"
          label="Email address"
          labelMandatory
          type="email"
          placeholder="Enter your email"
          disabled={isLoading}
          autoComplete="email"
        />
        <div>
          <InputText
            hookForm={hookForm}
            field="password"
            label="Password"
            labelMandatory
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 8 characters with uppercase, lowercase, and
            numbers.
          </p>
        </div>
        <InputText
          hookForm={hookForm}
          field="confirmPassword"
          label="Confirm Password"
          labelMandatory
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          autoComplete="new-password"
        />
        <Button
          type="submit"
          className="w-full bg-[#1a56db] hover:bg-[#1546b3]"
          size="lg"
          disabled={isLoading || success}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : success ? (
            "Account created!"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={
            enrollCourse
              ? `/login?enrollCourse=${enrollCourse}&contentType=${
                  contentType || ""
                }&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`
              : "/login"
          }
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
