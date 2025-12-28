import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          leftTitle="Complete Legal Learning Management Solution"
          leftDescription="Streamline your legal education and training with our comprehensive platform designed for modern law firms and institutions."
        >
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AuthLayout>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  return (
    <AuthLayout
      leftTitle="Complete Legal Learning Management Solution"
      leftDescription="Streamline your legal education and training with our comprehensive platform designed for modern law firms and institutions."
    >
      <LoginForm />
    </AuthLayout>
  );
}
