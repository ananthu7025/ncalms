import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          leftTitle="Reset Your Password"
          leftDescription="Create a new, strong password for your account."
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </AuthLayout>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  return (
    <AuthLayout
      leftTitle="Reset Your Password"
      leftDescription="Create a new, strong password for your account."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
