"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import InputText from "@/components/InputComponents/InputText";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form validation schema
const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Check if user is trying to enroll in a course
  const enrollCourse = searchParams.get("enrollCourse");
  const contentType = searchParams.get("contentType");
  const isBundle = searchParams.get("isBundle") === "true";
  const price = parseFloat(searchParams.get("price") || "0");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form
  const hookForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(data.email, data.password);

      if (result.success) {
        // Redirect based on role
        if (result.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          if (enrollCourse) {
            const enrollParams = new URLSearchParams({
              autoEnroll: "true",
              subjectId: enrollCourse,
              ...(contentType && { contentTypeId: contentType }),
              isBundle: isBundle.toString(),
              price: price.toString(),
            });
            router.push(`/learner/cart?${enrollParams.toString()}`);
          } else if (
            callbackUrl &&
            callbackUrl !== "/" &&
            callbackUrl !== "/login"
          ) {
            router.push(callbackUrl);
          } else {
            router.push("/learner/dashboard");
          }
        }
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password");
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
        <h2 className="text-3xl font-bold tracking-tight">
          Sign in to your account
        </h2>
        <p className="text-muted-foreground">
          {enrollCourse
            ? "Please sign in to enroll in this course."
            : "Welcome back! Please enter your details."}
        </p>
      </div>

      {enrollCourse && (
        <Alert>
          <AlertDescription>
            After signing in, the course will be added to your cart
            automatically.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={hookForm.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <InputText
          hookForm={hookForm}
          field="email"
          label="Email address"
          labelMandatory
          type="email"
          placeholder="admin@example.com"
          disabled={isLoading}
          autoComplete="email"
        />
        <InputText
          hookForm={hookForm}
          field="password"
          label="Password"
          labelMandatory
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2"></div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#1a56db] hover:bg-[#1546b3]"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={
            enrollCourse
              ? `/register?enrollCourse=${enrollCourse}&contentType=${
                  contentType || ""
                }&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`
              : "/register"
          }
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
