import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          leftTitle="Join the Premier Legal Education Network"
          leftDescription="Connect with top legal professionals and access our extensive library of resources, webinars, and interactive courses."
          showFeatures={true}
        >
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AuthLayout>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  return (
    <AuthLayout
      leftTitle="Join the Premier Legal Education Network"
      leftDescription="Connect with top legal professionals and access our extensive library of resources, webinars, and interactive courses."
      showFeatures={true}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
