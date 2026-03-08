import { ForgotPasswordForm } from "./forgot-password-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Forgot password | Canadian Citizenship",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Forgot password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
        <ForgotPasswordForm />
    </div>
  );
}
