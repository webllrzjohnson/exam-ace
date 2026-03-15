import type { Session } from "next-auth";

export type UserTier = "guest" | "free" | "premium";

export const TIER_LIMITS = {
  guest: {
    canTakeQuizzes: true,
    canSubmitTestimonial: false,
    canSeeResults: true,
    canAccessDashboard: false,
    canAccessFlashcards: false,
    canAccessSimulations: false,
    canAccessLeaderboard: false,
    canAccessReview: false,
    canSeeFeedback: false,
    canAppearInLeaderboard: false,
    maxQuestionsPerQuiz: 10,
    dailyQuizLimit: null,
  },
  free: {
    canTakeQuizzes: true,
    canSubmitTestimonial: false,
    canSeeResults: true,
    canAccessDashboard: true,
    canAccessFlashcards: false,
    canAccessSimulations: false,
    canAccessLeaderboard: true,
    canAccessReview: false,
    canSeeFeedback: false,
    canAppearInLeaderboard: true,
    maxQuestionsPerQuiz: 10,
    dailyQuizLimit: null,
  },
  premium: {
    canTakeQuizzes: true,
    canSeeResults: true,
    canAccessDashboard: true,
    canAccessFlashcards: true,
    canAccessSimulations: true,
    canAccessLeaderboard: true,
    canAccessReview: true,
    canSeeFeedback: true,
    canAppearInLeaderboard: true,
    canSubmitTestimonial: true,
    maxQuestionsPerQuiz: null,
    dailyQuizLimit: null,
  },
} as const;

export function getUserTier(session: Session | null): UserTier {
  if (!session?.user) return "guest";
  if (session.user.role === "admin") return "premium";
  return session.user.subscriptionTier === "premium" ? "premium" : "free";
}

export function canAccessFeature(
  tier: UserTier,
  feature: keyof typeof TIER_LIMITS.guest
): boolean {
  return TIER_LIMITS[tier][feature] as boolean;
}

export function getMaxQuestions(tier: UserTier): number | null {
  return TIER_LIMITS[tier].maxQuestionsPerQuiz;
}

export function getDailyLimit(tier: UserTier): number | null {
  return TIER_LIMITS[tier].dailyQuizLimit;
}

export function isPremium(session: Session | null): boolean {
  return getUserTier(session) === "premium";
}

export function isGuest(session: Session | null): boolean {
  return getUserTier(session) === "guest";
}

export function isFree(session: Session | null): boolean {
  return getUserTier(session) === "free";
}
