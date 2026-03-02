import { db } from "@/lib/db";

export async function getQuizBySlug(slug: string) {
  return db.quiz.findUnique({
    where: { slug },
    include: {
      category: true,
      questions: true,
    },
  });
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
