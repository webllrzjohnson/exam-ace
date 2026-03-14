import Link from "next/link";
import { Crown, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Upgrade Successful | Canadian Citizenship",
  description: "Welcome to Premium",
};

export default function UpgradeSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="container max-w-md text-center px-4">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Welcome to Premium
        </h1>
        <p className="text-muted-foreground mb-8">
          Your subscription is active. You now have full access to flashcards, simulations, review mode, and more.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
        >
          <Crown className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
