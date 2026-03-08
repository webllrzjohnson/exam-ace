import { db } from "@/lib/db";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  avgScore: number;
  quizCount: number;
  streak: number;
};

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const attempts = await db.quizAttempt.groupBy({
    by: ["userId"],
    where: { completedAt: { gte: thirtyDaysAgo } },
    _avg: { score: true },
    _count: { id: true },
  });

  if (attempts.length === 0) return [];

  const userIds = attempts.map((a) => a.userId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const entries: LeaderboardEntry[] = attempts
    .filter((a) => a._avg.score != null)
    .map((a) => ({
      userId: a.userId,
      name: userMap.get(a.userId)?.name ?? userMap.get(a.userId)?.email?.split("@")[0] ?? "Anonymous",
      avgScore: Math.round(a._avg.score!),
      quizCount: a._count.id,
      streak: 0,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, limit)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const streakMap = await getStreaksForUsers(userIds);
  return entries.map((e) => ({
    ...e,
    streak: streakMap.get(e.userId) ?? 0,
  }));
}

async function getStreaksForUsers(userIds: string[]): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  for (const userId of userIds) {
    const streak = await getStreak(userId);
    result.set(userId, streak);
  }
  return result;
}

export async function getStreak(userId: string): Promise<number> {
  const attempts = await db.quizAttempt.findMany({
    where: { userId },
    select: { completedAt: true },
    orderBy: { completedAt: "desc" },
  });

  const uniqueDates = Array.from(new Set(attempts.map((a) => a.completedAt.toISOString().slice(0, 10)))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let expected = uniqueDates[0];
  if (expected !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (expected !== yesterday.toISOString().slice(0, 10)) return 0;
  }

  for (const d of uniqueDates) {
    if (d !== expected) break;
    streak++;
    const prev = new Date(expected);
    prev.setDate(prev.getDate() - 1);
    expected = prev.toISOString().slice(0, 10);
  }
  return streak;
}

export type CategoryProgress = {
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
  attemptCount: number;
  totalTimeSeconds: number;
  passedCount: number;
  avgScore: number;
  lastAttemptAt: Date;
};

export type UserProgress = {
  quizCount: number;
  avgScore: number;
  streak: number;
  passedCount: number;
  totalTimeSeconds: number;
  categoryProgress: CategoryProgress[];
  recentAttempts: Array<{
    id: string;
    quizId: string;
    score: number;
    passed: boolean;
    timeTaken: number;
    mode: string;
    completedAt: Date;
    quizTitle?: string;
    categoryName?: string;
    questionCount?: number;
  }>;
};

export async function getUserProgress(userId: string): Promise<UserProgress> {
  const [attempts, quizCount, avgResult, streak, allAttemptsForCategories] = await Promise.all([
    db.quizAttempt.findMany({
      where: { userId },
      select: {
        id: true,
        quizId: true,
        score: true,
        passed: true,
        timeTaken: true,
        mode: true,
        completedAt: true,
      },
      orderBy: { completedAt: "desc" },
      take: 20,
    }),
    db.quizAttempt.count({ where: { userId } }),
    db.quizAttempt.aggregate({
      where: { userId },
      _avg: { score: true },
      _sum: { timeTaken: true },
    }),
    getStreak(userId),
    db.quizAttempt.findMany({
      where: { userId },
      select: { quizId: true, score: true, passed: true, timeTaken: true, completedAt: true },
    }),
  ]);

  const quizIds = Array.from(new Set([...attempts.map((a) => a.quizId), ...allAttemptsForCategories.map((a) => a.quizId)]));
  const quizzes = await db.quiz.findMany({
    where: { OR: [{ id: { in: quizIds } }, { slug: { in: quizIds } }] },
    select: {
      id: true,
      slug: true,
      title: true,
      categoryId: true,
      category: { select: { name: true, slug: true, icon: true } },
      _count: { select: { questions: true } },
    },
  });

  const quizMap = new Map<
    string,
    { title: string; categoryName: string; categorySlug: string; categoryIcon: string; questionCount: number }
  >();
  for (const q of quizzes) {
    const info = {
      title: q.title,
      categoryName: q.category.name,
      categorySlug: q.category.slug,
      categoryIcon: q.category.icon,
      questionCount: q._count.questions,
    };
    quizMap.set(q.id, info);
    quizMap.set(q.slug, info);
  }

  const categoryMap = new Map<
    string,
    { attemptCount: number; totalTime: number; passedCount: number; scoreSum: number; lastAttempt: Date }
  >();
  for (const a of allAttemptsForCategories) {
    const quiz = quizMap.get(a.quizId);
    if (!quiz) continue;
    const slug = quiz.categorySlug;
    const existing = categoryMap.get(slug);
    if (existing) {
      existing.attemptCount++;
      existing.totalTime += a.timeTaken;
      if (a.passed) existing.passedCount++;
      existing.scoreSum += a.score;
      if (a.completedAt > existing.lastAttempt) existing.lastAttempt = a.completedAt;
    } else {
      categoryMap.set(slug, {
        attemptCount: 1,
        totalTime: a.timeTaken,
        passedCount: a.passed ? 1 : 0,
        scoreSum: a.score,
        lastAttempt: a.completedAt,
      });
    }
  }

  const categoryProgress: CategoryProgress[] = [];
  for (const [slug, data] of Array.from(categoryMap.entries())) {
    const firstQuiz = quizzes.find((q) => q.category.slug === slug);
    if (!firstQuiz) continue;
    categoryProgress.push({
      categoryName: firstQuiz.category.name,
      categorySlug: slug,
      categoryIcon: firstQuiz.category.icon,
      attemptCount: data.attemptCount,
      totalTimeSeconds: data.totalTime,
      passedCount: data.passedCount,
      avgScore: Math.round(data.scoreSum / data.attemptCount),
      lastAttemptAt: data.lastAttempt,
    });
  }
  categoryProgress.sort((a, b) => b.lastAttemptAt.getTime() - a.lastAttemptAt.getTime());

  const passedCount = allAttemptsForCategories.filter((a) => a.passed).length;

  return {
    quizCount,
    avgScore: avgResult._avg.score ? Math.round(avgResult._avg.score) : 0,
    streak,
    passedCount,
    totalTimeSeconds: avgResult._sum.timeTaken ?? 0,
    categoryProgress,
    recentAttempts: attempts.map((a) => {
      const q = quizMap.get(a.quizId);
      return {
        ...a,
        quizTitle: q?.title ?? undefined,
        categoryName: q?.categoryName ?? undefined,
        questionCount: q?.questionCount ?? undefined,
      };
    }),
  };
}
