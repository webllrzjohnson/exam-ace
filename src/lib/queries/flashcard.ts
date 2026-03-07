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
};

export type FlashcardSetMeta = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  cardCount: number;
};

export async function getFlashcardSetsMeta(): Promise<FlashcardSetMeta[]> {
  const categories = await db.category.findMany({
    include: {
      quizzes: {
        include: {
          questions: {
            where: { type: { not: "matching" } },
            select: { id: true, question: true, correctAnswer: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((c) => {
    const seen = new Set<string>();
    for (const quiz of c.quizzes) {
      for (const q of quiz.questions) {
        const answer = formatAnswer(q.correctAnswer);
        seen.add(`${q.question}|${answer}`);
      }
    }
    return {
      id: c.slug,
      name: c.name,
      icon: c.icon,
      description: c.description,
      color: c.color,
      cardCount: seen.size,
    };
  });
}

export async function getFlashcardsByCategory(categorySlug: string): Promise<Flashcard[] | null> {
  const category = await db.category.findUnique({
    where: { slug: categorySlug },
    include: {
      quizzes: {
        include: {
          questions: {
            where: { type: { not: "matching" } },
            select: { id: true, question: true, correctAnswer: true, explanation: true },
          },
        },
      },
    },
  });

  if (!category) return null;

  const cards: Flashcard[] = [];
  const seen = new Set<string>();

  for (const quiz of category.quizzes) {
    for (const q of quiz.questions) {
      const answer = formatAnswer(q.correctAnswer);
      const back = q.explanation ? `${answer}\n\n${q.explanation}` : answer;
      const key = `${q.question}|${answer}`;
      if (!seen.has(key)) {
        seen.add(key);
        cards.push({ id: q.id, front: q.question, back });
      }
    }
  }

  if (cards.length === 0) return null;

  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
