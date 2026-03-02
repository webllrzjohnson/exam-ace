import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");
    const quizzes = await db.quiz.findMany({
      include: { category: true, questions: true },
      orderBy: { title: "asc" },
    });
    if (quizId) {
      const quiz = quizzes.find((q) => q.id === quizId || q.slug === quizId);
      if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      return NextResponse.json({
        id: quiz.id,
        slug: quiz.slug,
        title: quiz.title,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          topic: q.topic,
          difficulty: q.difficulty,
        })),
      });
    }
    return NextResponse.json(
      quizzes.map((q) => ({
        id: q.id,
        slug: q.slug,
        title: q.title,
        questionCount: q.questions.length,
      }))
    );
  } catch (e) {
    console.error("[api/quizzes/list]", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
