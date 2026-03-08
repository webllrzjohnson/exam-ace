import { db } from "@/lib/db";

function formatAnswer(correctAnswer: unknown): string {
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.join(", ");
  }
  return String(correctAnswer ?? "");
}

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  answer: string;
  explanation: string | null;
};

export type FlashcardSetMeta = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  cardCount: number;
};

async function buildCardsFromQuestions(
  questions: { id: string; question: string; correctAnswer: unknown; explanation: string | null }[]
): Promise<Flashcard[]> {
  const cards: Flashcard[] = [];
  const seen = new Set<string>();

  for (const q of questions) {
    const answer = formatAnswer(q.correctAnswer);
    const key = `${q.question}|${answer}`;
    if (!seen.has(key)) {
      seen.add(key);
      cards.push({
        id: q.id,
        front: q.question,
        back: q.explanation ? `${answer}\n\n${q.explanation}` : answer,
        answer,
        explanation: q.explanation,
      });
    }
  }

  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getFlashcardSetsMeta(): Promise<FlashcardSetMeta[]> {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const dedupedCounts = await Promise.all(
    categories.map(async (c) => {
      const questions = await db.question.findMany({
        where: {
          type: { not: "matching" },
          quiz: { categoryId: c.id },
        },
        select: { question: true, correctAnswer: true },
      });
      const seen = new Set<string>();
      for (const q of questions) {
        seen.add(`${q.question}|${formatAnswer(q.correctAnswer)}`);
      }
      return { slug: c.slug, count: seen.size };
    })
  );
  const countBySlug = Object.fromEntries(dedupedCounts.map((d) => [d.slug, d.count]));

  const sets: FlashcardSetMeta[] = categories.map((c) => ({
    id: c.slug,
    name: c.name,
    icon: c.icon,
    description: c.description,
    color: c.color,
    cardCount: countBySlug[c.slug] ?? 0,
  }));

  const totalAll = sets.reduce((s, x) => s + x.cardCount, 0);
  if (totalAll > 0) {
    sets.unshift({
      id: "all",
      name: "All Topics",
      icon: "📚",
      description: "Every question across all categories",
      color: "#6366f1",
      cardCount: totalAll,
    });
  }

  return sets;
}

export async function getFlashcardsByCategory(categorySlug: string): Promise<Flashcard[] | null> {
  if (categorySlug === "all") {
    return getFlashcardsAll();
  }

  const category = await db.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });
  if (!category) return null;

  const questions = await db.question.findMany({
    where: {
      type: { not: "matching" },
      quiz: { categoryId: category.id },
    },
    select: { id: true, question: true, correctAnswer: true, explanation: true },
  });

  if (questions.length === 0) return null;
  return buildCardsFromQuestions(questions);
}

export async function getFlashcardsAll(): Promise<Flashcard[] | null> {
  const questions = await db.question.findMany({
    where: { type: { not: "matching" } },
    select: { id: true, question: true, correctAnswer: true, explanation: true },
  });

  if (questions.length === 0) return null;
  return buildCardsFromQuestions(questions);
}

const PRESET_COUNTS = [5, 10, 15, 20, 25, 30, 35, 40, 50, 75, 100] as const;
const MAX_CUSTOM_COUNT = 500;

export { PRESET_COUNTS, MAX_CUSTOM_COUNT };

export async function getFlashcardsByCategoryWithCount(
  categorySlug: string,
  count: number,
  excludeIds: string[] = []
): Promise<Flashcard[] | null> {
  const clampedCount = Math.min(Math.max(1, Math.floor(count)), MAX_CUSTOM_COUNT);
  const excludeSet = new Set(excludeIds);

  let questions: { id: string; question: string; correctAnswer: unknown; explanation: string | null }[];

  if (categorySlug === "all") {
    questions = await db.question.findMany({
      where: { type: { not: "matching" } },
      select: { id: true, question: true, correctAnswer: true, explanation: true },
    });
  } else {
    const category = await db.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });
    if (!category) return null;

    questions = await db.question.findMany({
      where: {
        type: { not: "matching" },
        quiz: { categoryId: category.id },
      },
      select: { id: true, question: true, correctAnswer: true, explanation: true },
    });
  }

  if (questions.length === 0) return null;

  const filtered = excludeSet.size > 0 ? questions.filter((q) => !excludeSet.has(q.id)) : questions;
  const pool = filtered.length > 0 ? filtered : questions;

  return buildCardsFromQuestions(pool).then((cards) => cards.slice(0, clampedCount));
}
