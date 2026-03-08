import { ResetForm } from "./reset-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reset password | Canadian Citizenship",
  description: "Set a new password",
};

type Props = { params: Promise<{ token: string }> };

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <ResetForm token={token} />
    </div>
  );
}
