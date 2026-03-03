import { db } from "@/lib/db";

const QUESTIONS_PER_SIMULATION = 20;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function getSimulationQuestionsMixed(): Promise<
  { id: string; type: string; question: string; options: unknown; correctAnswer: unknown; explanation: string; topic: string; difficulty: string }[]
> {
  const questions = await db.question.findMany({
    include: { quiz: { include: { category: true } } },
  });
  const eligible = questions.filter((q) => q.type !== "matching" && q.options);
  const shuffled = shuffle(eligible);
  return shuffled.slice(0, QUESTIONS_PER_SIMULATION).map((q) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    topic: q.topic,
    difficulty: q.difficulty,
  }));
}

export async function getSimulationQuestionsByCategory(
  categorySlug: string
): Promise<
  { id: string; type: string; question: string; options: unknown; correctAnswer: unknown; explanation: string; topic: string; difficulty: string }[]
> {
  const questions = await db.question.findMany({
    where: { quiz: { category: { slug: categorySlug } } },
    include: { quiz: { include: { category: true } } },
  });
  const eligible = questions.filter((q) => q.type !== "matching" && q.options);
  const shuffled = shuffle(eligible);
  return shuffled.slice(0, QUESTIONS_PER_SIMULATION).map((q) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    topic: q.topic,
    difficulty: q.difficulty,
  }));
}
