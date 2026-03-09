"use client";

import { useRouter } from "next/navigation";
import { X, Check, Sparkles } from "lucide-react";

type UpgradePromptProps = {
  feature: string;
  reason?: "daily_limit" | "premium_feature" | "guest";
  attemptsUsed?: number;
  attemptsLimit?: number;
  onClose?: () => void;
};

export function UpgradePrompt({ feature, reason, attemptsUsed, attemptsLimit, onClose }: UpgradePromptProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/upgrade");
  };

  const handleSignUp = () => {
    router.push("/register");
  };

  const isGuest = reason === "guest";
  const isDailyLimit = reason === "daily_limit";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {isGuest ? "Sign Up Required" : "Upgrade to Premium"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isGuest ? "Create a free account to get started" : "Unlock all features"}
            </p>
          </div>
        </div>

        {isDailyLimit && attemptsLimit && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-foreground font-medium">
              Daily Limit Reached: {attemptsUsed}/{attemptsLimit} quizzes
            </p>
            <p className="text-xs text-muted-foreground mt-1">Upgrade to Premium for unlimited attempts</p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            {isGuest
              ? `Sign up for a free account to access ${feature} and track your progress.`
              : `Upgrade to Premium to unlock ${feature} and more.`}
          </p>

          {!isGuest && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-success" />
                <span>Unlimited quiz attempts (already have!)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-success" />
                <span>Custom question count (5-50)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-success" />
                <span>Flashcards & simulation exams</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-success" />
                <span>Leaderboard & review mode</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-success" />
                <span>Instant feedback in practice mode</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {isGuest ? (
            <>
              <button
                onClick={handleSignUp}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Sign Up Free
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-semibold border border-border hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleUpgrade}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Upgrade to Premium
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-semibold border border-border hover:bg-muted transition-colors"
                >
                  Maybe Later
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
