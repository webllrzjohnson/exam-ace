"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Crown, User, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = session?.user?.subscriptionTier === "premium";

  const handleManageSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Failed to open billing portal");
        setIsLoading(false);
      }
    } catch {
      setError("Failed to open billing portal");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Manage Subscription
        </h1>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Current Plan
              </h2>
              <div className="flex items-center gap-2">
                {isPremium ? (
                  <>
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="text-lg font-medium text-foreground">Premium</span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg font-medium text-foreground">Free</span>
                  </>
                )}
              </div>
            </div>
            {isPremium && (
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">$9.99</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            )}
          </div>

          {isPremium ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You have full access to all premium features including flashcards, simulations, review mode, and custom quiz lengths.
              </p>

              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Opening billing portal...
                  </>
                ) : (
                  <>
                    Manage Subscription
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                You'll be redirected to Stripe's secure billing portal where you can update payment methods, view invoices, or cancel your subscription.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Upgrade to Premium to unlock flashcards, simulations, review mode, instant feedback, and custom quiz lengths.
              </p>

              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Premium
              </Link>
            </div>
          )}
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have questions about your subscription or need assistance, please contact support.
          </p>
          <Link
            href="/pricing"
            className="text-sm text-primary hover:underline font-medium"
          >
            View pricing details →
          </Link>
        </div>
      </div>
    </div>
  );
}
