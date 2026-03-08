import { RegisterForm } from "./register-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign up | Canadian Citizenship",
  description: "Create an account to track your progress and compete on the leaderboard",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to track your progress and compete on the leaderboard
          </p>
        </div>
        <RegisterForm />
    </div>
  );
}
