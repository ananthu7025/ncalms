"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { registerUser, loginUser } from "@/lib/actions/auth";

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <AuthLayout
                leftTitle="Join the Premier Legal Education Network"
                leftDescription="Connect with top legal professionals and access our extensive library of resources, webinars, and interactive courses."
                showFeatures={true}
            >
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AuthLayout>
        }>
            <RegisterFormContent />
        </Suspense>
    );
}

function RegisterFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check if user is trying to enroll in a course
    const enrollCourse = searchParams.get("enrollCourse");
    const contentType = searchParams.get("contentType");
    const isBundle = searchParams.get("isBundle") === "true";
    const price = parseFloat(searchParams.get("price") || "0");
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);

        try {
            const result = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (result.success) {
                setSuccess(true);

                // If user is enrolling, auto-login and redirect to cart with enrollment params
                if (enrollCourse) {
                    try {
                        // Auto-login the user
                        const loginResult = await loginUser(formData.email, formData.password);

                        if (loginResult.success) {
                            // Redirect to cart with enrollment params
                            // The cart page will handle adding the item on load
                            const enrollParams = new URLSearchParams({
                                autoEnroll: 'true',
                                subjectId: enrollCourse,
                                ...(contentType && { contentTypeId: contentType }),
                                isBundle: isBundle.toString(),
                                price: price.toString(),
                            });

                            setTimeout(() => {
                                router.push(`/learner/cart?${enrollParams.toString()}`);
                                router.refresh();
                            }, 1000);
                        } else {
                            // If auto-login fails, redirect to login with enrollment params
                            setTimeout(() => {
                                router.push(`/login?enrollCourse=${enrollCourse}&contentType=${contentType || ''}&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`);
                            }, 2000);
                        }
                    } catch (enrollError) {
                        console.error("Error during enrollment:", enrollError);
                        // Redirect to login with enrollment params
                        setTimeout(() => {
                            router.push(`/login?enrollCourse=${enrollCourse}&contentType=${contentType || ''}&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`);
                        }, 2000);
                    }
                } else {
                    // Normal registration - redirect to login after 2 seconds
                    setTimeout(() => {
                        router.push("/login");
                    }, 2000);
                }
            } else {
                setError(result.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            leftTitle="Join the Premier Legal Education Network"
            leftDescription="Connect with top legal professionals and access our extensive library of resources, webinars, and interactive courses."
            showFeatures={true}
        >
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
                            After creating your account, the course will be added to your cart automatically.
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            autoComplete="name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        <p className="text-xs text-muted-foreground">
                            Must be at least 8 characters with uppercase, lowercase, and numbers.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>

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
                    Already have an account?{' '}
                    <Link
                        href={enrollCourse
                            ? `/login?enrollCourse=${enrollCourse}&contentType=${contentType || ''}&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`
                            : "/login"
                        }
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
