import HomePage from "@/pages/HomePage";
import { getCategories } from "@/lib/queries/quiz";
import { db } from "@/lib/db";

export default async function Home() {
  const categories = await getCategories();
  const featuredQuizzes = await db.quiz.findMany({
    where: { featured: true },
    include: { category: true, questions: true },
  });
  const featured = featuredQuizzes.map((q) => ({
    id: q.slug,
    title: q.title,
    description: q.description,
    category: q.category.slug,
    categoryIcon: q.categoryIcon,
    difficulty: q.difficulty,
    questionCount: q.questions.length,
    timeLimit: q.timeLimit,
    passRate: q.passRate,
    avgScore: q.avgScore,
    topics: q.topics,
    featured: q.featured,
  }));
  return <HomePage categories={categories} featured={featured} />;
}
