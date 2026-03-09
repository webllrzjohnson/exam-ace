"use client";

import Link from "next/link";
import {
  Check,
  X,
  Crown,
  User,
  UserPlus,
  Zap,
  Target,
  BookOpen,
  Shield,
  DollarSign,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
} from "lucide-react";

const TIER_FEATURES = [
  {
    label: "Take practice quizzes",
    guest: true,
    free: true,
    premium: true,
  },
  {
    label: "See quiz results",
    guest: true,
    free: true,
    premium: true,
  },
  {
    label: "Questions per quiz",
    guest: "10",
    free: "10",
    premium: "5–50 (custom)",
  },
  {
    label: "Review mode with explanations",
    guest: false,
    free: false,
    premium: true,
  },
  {
    label: "Access dashboard",
    guest: false,
    free: true,
    premium: true,
  },
  {
    label: "Flashcards",
    guest: false,
    free: false,
    premium: true,
  },
  {
    label: "Simulation exams",
    guest: false,
    free: false,
    premium: true,
  },
  {
    label: "Leaderboard access",
    guest: false,
    free: true,
    premium: true,
  },
  {
    label: "Appear on leaderboard",
    guest: false,
    free: true,
    premium: true,
  },
  {
    label: "Instant feedback in practice",
    guest: false,
    free: false,
    premium: true,
  },
] as const;

function FeatureCell({
  value,
}: {
  value: boolean | string;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-5 h-5 text-success shrink-0" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/50 shrink-0" />
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-12 md:py-16 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Compare Plans
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose the Right Plan for Your Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From casual browsing to full exam preparation — find the plan that fits your goals.
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="text-center py-4 px-4">
                  <div className="flex flex-col items-center gap-1">
                    <User className="w-6 h-6 text-muted-foreground" />
                    <span className="font-semibold text-foreground">Guest</span>
                    <span className="text-xs text-muted-foreground">Try before signing up</span>
                  </div>
                </th>
                <th className="text-center py-4 px-4">
                  <div className="flex flex-col items-center gap-1">
                    <UserPlus className="w-6 h-6 text-muted-foreground" />
                    <span className="font-semibold text-foreground">Free</span>
                    <span className="text-xs text-muted-foreground">Create an account</span>
                  </div>
                </th>
                <th className="text-center py-4 px-4 bg-gradient-to-b from-amber-500/5 to-transparent rounded-t-xl">
                  <div className="flex flex-col items-center gap-1">
                    <Crown className="w-6 h-6 text-amber-500" />
                    <span className="font-semibold text-foreground">Premium</span>
                    <span className="text-xs text-amber-600 font-medium">$9.99/month</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {TIER_FEATURES.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-border ${i % 2 === 1 ? "bg-muted/30" : ""}`}
                >
                  <td className="py-3 px-4 text-sm text-foreground">{row.label}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex justify-center">
                      <FeatureCell value={row.guest} />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex justify-center">
                      <FeatureCell value={row.free} />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center bg-amber-500/5">
                    <span className="inline-flex justify-center">
                      <FeatureCell value={row.premium} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border border-border hover:bg-muted transition-colors"
          >
            Start Free
          </Link>
          <Link
            href="/upgrade"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Premium
          </Link>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-3">
            Why Premium Matters for Your Citizenship Test
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            The Canadian citizenship test is a one-time opportunity. Being underprepared can delay your dream by months or years.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Simulation Exams</h3>
              <p className="text-sm text-muted-foreground">
                Practice under real exam conditions. The official test has 20 questions — our simulations let you build stamina and confidence.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Flashcards & Review</h3>
              <p className="text-sm text-muted-foreground">
                Master weak areas with flashcards. Review every question with detailed explanations so you understand, not just memorize.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Learn as you go. See why each answer is right or wrong immediately — the fastest way to improve.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Custom Quiz Length</h3>
              <p className="text-sm text-muted-foreground">
                Choose 5–50 questions per quiz. Short bursts for commutes, full-length for serious study sessions.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4">
                <DollarSign className="w-4 h-4" />
                The Smartest Investment You&apos;ll Make
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Less Than a Coffee — A Lifetime of Benefits
              </h2>
              <p className="text-muted-foreground mb-4">
                Canadian citizenship opens doors: healthcare, voting rights, travel freedom, and security for your family. The citizenship application fee alone is hundreds of dollars. A failed test means rescheduling, more waiting, and more stress.
              </p>
              <p className="text-muted-foreground mb-4">
                For less than the cost of a few coffees, Premium gives you the full toolkit to pass confidently on your first attempt. It&apos;s not an expense — it&apos;s an investment in your future in Canada.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Pass on first try</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Save months of waiting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Peace of mind</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-card border border-border rounded-2xl p-8 text-center min-w-[220px]">
                <div className="text-4xl font-bold text-foreground">$9.99</div>
                <div className="text-muted-foreground text-sm mb-4">per month</div>
                <Link
                  href="/upgrade"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                >
                  Get Premium
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Not sure yet? Start as a guest or create a free account — no credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quizzes" className="text-primary font-medium hover:underline">
              Try a quiz as guest →
            </Link>
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create free account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
