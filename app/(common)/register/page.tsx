"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
    const router = useRouter();

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
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
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
                    <p className="text-muted-foreground">Join our learning platform today</p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                            Account created successfully! Redirecting to login...
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
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
