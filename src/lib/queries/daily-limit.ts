import { db } from "@/lib/db";
import { getUserTier, getDailyLimit, type UserTier } from "@/lib/access-control";
import type { Session } from "next-auth";

export async function getDailyAttempts(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await db.dailyQuizLimit.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  return record?.attempts ?? 0;
}

export async function incrementDailyAttempts(userId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await db.dailyQuizLimit.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      attempts: {
        increment: 1,
      },
    },
    create: {
      userId,
      date: today,
      attempts: 1,
    },
  });
}

export async function canTakeQuiz(session: Session | null): Promise<{
  allowed: boolean;
  reason?: string;
  attemptsUsed?: number;
  attemptsLimit?: number;
}> {
  const tier = getUserTier(session);

  if (tier === "guest") {
    return { allowed: true };
  }

  if (tier === "premium") {
    return { allowed: true };
  }

  if (!session?.user?.id) {
    return { allowed: true };
  }

  const limit = getDailyLimit(tier);
  if (limit === null) {
    return { allowed: true };
  }

  const attemptsUsed = await getDailyAttempts(session.user.id);

  if (attemptsUsed >= limit) {
    return {
      allowed: false,
      reason: "daily_limit_exceeded",
      attemptsUsed,
      attemptsLimit: limit,
    };
  }

  return {
    allowed: true,
    attemptsUsed,
    attemptsLimit: limit,
  };
}

export async function getRemainingAttempts(session: Session | null): Promise<number | null> {
  const tier = getUserTier(session);

  if (tier === "guest") return 0;
  if (tier === "premium") return null;

  if (!session?.user?.id) return 0;

  const limit = getDailyLimit(tier);
  if (limit === null) return null;

  const used = await getDailyAttempts(session.user.id);
  return Math.max(0, limit - used);
}
