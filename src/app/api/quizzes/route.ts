import { NextResponse } from "next/server";
import { getQuizzes } from "@/lib/queries/quiz";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const quizzes = await getQuizzes({
      categorySlug: category ?? undefined,
      featured: featured === "true" ? true : undefined,
    });
    const mapped = quizzes.map((q) => ({
      id: q.slug,
      slug: q.slug,
      title: q.title,
      description: q.description,
      category: q.category.slug,
      categoryIcon: q.categoryIcon,
      difficulty: q.difficulty,
      questionCount: q.questions?.length ?? 0,
      timeLimit: q.timeLimit,
      passRate: q.passRate,
      avgScore: q.avgScore,
      topics: q.topics,
      featured: q.featured,
    }));
    return NextResponse.json(mapped);
  } catch (e) {
    console.error("[api/quizzes]", e);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
