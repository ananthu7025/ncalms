"use client";

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { forgotPassword } from '@/lib/actions/auth';
import toaster from '@/lib/toaster';

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toaster.error("Please enter your email address");
            return;
        }

        startTransition(() => {
            forgotPassword(email)
                .then((data) => {
                    if (data.success) {
                        setIsSuccess(true);
                        toaster.success(data.message as string);
                    } else {
                        toaster.error(data.error as string);
                    }
                })
                .catch(() => toaster.error("Something went wrong"));
        });
    };

    return (
        <AuthLayout
            leftTitle="Recover Your Account Access"
            leftDescription="Enter your email address to receive instructions on how to reset your password securely."
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Forgot Password?</h2>
                    <p className="text-muted-foreground">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                {!isSuccess ? (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        <Button
                            className="w-full bg-[#1a56db] hover:bg-[#1546b3]"
                            size="lg"
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Send Reset Link
                        </Button>
                    </form>
                ) : (
                    <div className="rounded-md bg-blue-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Check your email</h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
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
