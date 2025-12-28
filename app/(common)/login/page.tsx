"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { loginUser } from "@/lib/actions/auth";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <AuthLayout
                leftTitle="Complete Legal Learning Management Solution"
                leftDescription="Streamline your legal education and training with our comprehensive platform designed for modern law firms and institutions."
            >
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AuthLayout>
        }>
            <LoginFormContent />
        </Suspense>
    );
}

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // Check if user is trying to enroll in a course
    const enrollCourse = searchParams.get("enrollCourse");
    const contentType = searchParams.get("contentType");
    const isBundle = searchParams.get("isBundle") === "true";
    const price = parseFloat(searchParams.get("price") || "0");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await loginUser(email, password);

            if (result.success) {
                // Redirect based on role
                if (result.role === 'ADMIN') {
                    router.push('/admin/dashboard');
                } else {
                    // If enrolling, redirect to cart with enrollment params
                    // The cart page will handle adding the item on load
                    if (enrollCourse) {
                        const enrollParams = new URLSearchParams({
                            autoEnroll: 'true',
                            subjectId: enrollCourse,
                            ...(contentType && { contentTypeId: contentType }),
                            isBundle: isBundle.toString(),
                            price: price.toString(),
                        });
                        router.push(`/learner/cart?${enrollParams.toString()}`);
                    } else if (callbackUrl && callbackUrl !== '/' && callbackUrl !== '/login') {
                        router.push(callbackUrl);
                    } else {
                        router.push('/learner/dashboard');
                    }
                }
                router.refresh();
            } else {
                setError(result.error || "Invalid email or password");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            leftTitle="Complete Legal Learning Management Solution"
            leftDescription="Streamline your legal education and training with our comprehensive platform designed for modern law firms and institutions."
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
                    <p className="text-muted-foreground">
                        {enrollCourse
                            ? "Please sign in to enroll in this course."
                            : "Welcome back! Please enter your details."}
                    </p>
                </div>

                {enrollCourse && (
                    <Alert>
                        <AlertDescription>
                            After signing in, the course will be added to your cart automatically.
                        </AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            placeholder="admin@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* Optional Remember Me if needed */}
                        </div>
                        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
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
                    Don&apos;t have an account?{' '}
                    <Link
                        href={enrollCourse
                            ? `/register?enrollCourse=${enrollCourse}&contentType=${contentType || ''}&isBundle=${isBundle}&price=${price}&callbackUrl=${callbackUrl}`
                            : "/register"
                        }
                        className="font-medium text-primary hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
