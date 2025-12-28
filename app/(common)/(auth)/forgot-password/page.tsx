import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      leftTitle="Recover Your Account Access"
      leftDescription="Enter your email address to receive instructions on how to reset your password securely."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
