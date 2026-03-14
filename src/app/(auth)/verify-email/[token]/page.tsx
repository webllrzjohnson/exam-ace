import { verifyEmail } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verify email | Canadian Citizenship",
  description: "Verify your email address",
};

type Props = {
  params: Promise<{ token: string }>;
};

export default async function VerifyEmailPage({ params }: Props) {
  const { token } = await params;
  const result = await verifyEmail(token);

  if (result.success) {
    return (
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Email verified
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is ready. You can now sign in.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full rounded-lg bg-primary px-4 py-2 text-center font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Verification failed
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.error ?? "This link is invalid or has expired."}
        </p>
      </div>
      <Link
        href="/register"
        className="block w-full rounded-lg bg-primary px-4 py-2 text-center font-medium text-primary-foreground hover:bg-primary/90"
      >
        Register again
      </Link>
    </div>
  );
}
