import { db } from "@/lib/db";

const DIFFICULTY_ORDER = { Hard: 0, Medium: 1, Easy: 2 } as const;

export async function getAdvancedCitizenshipQuestions(count: number) {
  const allQuestions = await db.question.findMany({
    where: {
      quiz: {
        slug: { not: "advanced-citizenship" },
      },
    },
    include: { quiz: true },
  });
  const byDifficulty = [...allQuestions].sort(
    (a, b) => (DIFFICULTY_ORDER[b.difficulty as keyof typeof DIFFICULTY_ORDER] ?? 2) - (DIFFICULTY_ORDER[a.difficulty as keyof typeof DIFFICULTY_ORDER] ?? 2)
  );
  for (let i = byDifficulty.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [byDifficulty[i], byDifficulty[j]] = [byDifficulty[j], byDifficulty[i]];
  }
  return byDifficulty.slice(0, Math.min(count, byDifficulty.length));
}

export async function getQuizBySlug(slug: string, options?: { count?: number; timeLimit?: number | null }) {
  if (slug === "advanced-citizenship" && options?.count) {
    const baseQuiz = await db.quiz.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!baseQuiz) return null;
    const questions = await getAdvancedCitizenshipQuestions(options.count);
    const timeLimit = options.timeLimit ?? baseQuiz.timeLimit;
    return {
      ...baseQuiz,
      questions,
      timeLimit,
    };
  }

  const quiz = await db.quiz.findUnique({
    where: { slug },
    include: {
      category: true,
      questions: true,
    },
  });

  if (quiz) {
    const shuffled = [...quiz.questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { ...quiz, questions: shuffled };
  }

  return quiz;
}

export async function getQuizzes(filters?: { categorySlug?: string; featured?: boolean }) {
  return db.quiz.findMany({
    where: {
      ...(filters?.categorySlug && {
        category: { slug: filters.categorySlug },
      }),
      ...(filters?.featured !== undefined && { featured: filters.featured }),
    },
    include: { category: true, questions: true },
    orderBy: { title: "asc" },
  });
}

export async function getCategories() {
  const categories = await db.category.findMany({
    include: {
      _count: { select: { quizzes: true } },
    },
    orderBy: { name: "asc" },
  });
  return categories.map((c) => ({
    id: c.slug,
    name: c.name,
    icon: c.icon,
    description: c.description,
    quizCount: c._count.quizzes,
    color: c.color,
  }));
}
