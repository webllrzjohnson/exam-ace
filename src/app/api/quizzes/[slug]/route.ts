import { NextResponse } from "next/server";
import { getQuizBySlug } from "@/lib/queries/quiz";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const countParam = searchParams.get("count");
    const timeParam = searchParams.get("time");
    const untimed = searchParams.get("untimed") === "true";

    const options =
      slug === "advanced-citizenship" && countParam
        ? {
            count: Math.min(50, Math.max(5, parseInt(countParam, 10) || 20)),
            timeLimit: untimed ? 9999 : (timeParam ? parseInt(timeParam, 10) : 30),
          }
        : undefined;

    const quiz = await getQuizBySlug(slug, options);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    const mapped = {
      id: quiz.slug,
      slug: quiz.slug,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category.slug,
      categoryIcon: quiz.categoryIcon,
      difficulty: quiz.difficulty,
      questionCount: quiz.questions.length,
      timeLimit: options ? options.timeLimit : quiz.timeLimit,
      passRate: quiz.passRate,
      avgScore: quiz.avgScore,
      topics: quiz.topics,
      featured: quiz.featured,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options as string[] | undefined,
        correctAnswer: q.correctAnswer,
        matchPairs: q.matchPairs as { left: string; right: string }[] | undefined,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty,
      })),
    };
    return NextResponse.json(mapped);
  } catch (e) {
    console.error("[api/quizzes/[slug]]", e);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
