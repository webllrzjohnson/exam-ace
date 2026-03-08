import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in | Canadian Citizenship",
  description: "Sign in to track your progress and compete on the leaderboard",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to track your progress and compete on the leaderboard
          </p>
        </div>
        <LoginForm />
    </div>
  );
}
