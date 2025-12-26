"use client";

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { resetPassword } from '@/lib/actions/auth';
import toaster from '@/lib/toaster';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toaster.error("Invalid or missing reset token");
            // Optionally redirect to login or forgot password
        }
    }, [token]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toaster.error("Missing reset token");
            return;
        }

        if (password.length < 6) {
            toaster.error("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            toaster.error("Passwords do not match");
            return;
        }

        startTransition(() => {
            resetPassword(token, password)
                .then((data) => {
                    if (data.success) {
                        setIsSuccess(true);
                        toaster.success(data.message as string);
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    } else {
                        toaster.error(data.error as string);
                    }
                })
                .catch(() => toaster.error("Something went wrong"));
        });
    };

    if (!token) {
        return (
            <AuthLayout
                leftTitle="Invalid Request"
                leftDescription="The link you followed is invalid or missing required information."
            >
                <div>
                    <div className="rounded-md bg-red-50 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Missing Token</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>Please use the link sent to your email address.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <Link href="/forgot-password" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Request a new link
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            leftTitle="Reset Your Password"
            leftDescription="Create a new, strong password for your account."
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Set New Password</h2>
                    <p className="text-muted-foreground">
                        Your new password must be different from previously used passwords.
                    </p>
                </div>

                {!isSuccess ? (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="Enter new password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isPending}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    placeholder="Confirm new password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isPending}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
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
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Password reset successful</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>
                                        Your password has been updated. You will be redirected to the login page shortly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <Link href="/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
