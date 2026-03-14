"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check, Crown, Sparkles, Zap, Target, TrendingUp, Award, Clock, Loader2 } from "lucide-react";

export default function UpgradePage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (status !== "authenticated") {
      window.location.href = "/login?callbackUrl=/upgrade";
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data.error);
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-16 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 font-semibold text-sm mb-4">
            <Crown className="w-4 h-4" />
            Premium Membership
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unlock Your Full Potential
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Get unlimited access to all features and ace your Canadian Citizenship Test
          </p>
          <Link
            href="/pricing"
            className="text-sm text-primary hover:underline font-medium"
          >
            Compare Free, Registered & Premium plans →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Try before signing up</p>
            </div>

            <ul className="space-y-2.5 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">Unlimited quiz attempts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">10 questions per quiz</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">See results</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Dashboard</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Leaderboard</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Review mode</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Flashcards</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Simulation exams</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Instant feedback</span>
              </li>
            </ul>

            <Link
              href="/quizzes"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold border border-border hover:bg-muted transition-colors text-sm"
            >
              Try as Guest
            </Link>
          </div>

          <div className="bg-card border-2 border-primary/30 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Registered</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Create a free account</p>
            </div>

            <ul className="space-y-2.5 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">Unlimited quiz attempts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">10 questions per quiz</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">See results</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Dashboard access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Leaderboard access</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Review mode</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Flashcards</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Simulation exams</span>
              </li>
              <li className="flex items-start gap-3 opacity-40">
                <span className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground">✕</span>
                <span className="text-sm text-muted-foreground">Instant feedback</span>
              </li>
            </ul>

            <Link
              href="/register"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
            >
              Sign Up Free
            </Link>
          </div>

          <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-2 border-amber-500/30 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
              ALL FEATURES
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Premium
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">$9.99</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Paying user — full access</p>
            </div>

            <ul className="space-y-2.5 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Everything in Registered</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Custom question count (5–50)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Flashcards</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Simulation exams</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Review mode with explanations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Instant feedback in practice</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">Detailed progress analytics</span>
              </li>
            </ul>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting…
                </>
              ) : status === "authenticated" ? (
                "Get Premium — $9.99/month"
              ) : (
                "Sign in to Upgrade"
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Secure payment via Stripe. Cancel anytime.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-8">
            Why Upgrade to Premium?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Unlimited Practice</h3>
              <p className="text-sm text-muted-foreground">
                Take as many quizzes as you need to master the material
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Focused Learning</h3>
              <p className="text-sm text-muted-foreground">
                Use flashcards and simulations to target weak areas
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Detailed analytics and insights into your performance
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Compete & Excel</h3>
              <p className="text-sm text-muted-foreground">
                Join the leaderboard and see how you rank
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Pass Your Test with Confidence
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of successful test-takers who used our Premium features to prepare effectively and pass on their first attempt.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-foreground">
                <strong>45 min</strong> avg study time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-foreground">
                <strong>95%</strong> pass rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
