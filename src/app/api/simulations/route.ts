import { NextRequest, NextResponse } from "next/server";
import {
  getSimulationQuestionsMixed,
  getSimulationQuestionsByCategory,
} from "@/lib/queries/simulation";
import { auth } from "@/lib/auth";
import { isPremium } from "@/lib/access-control";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!isPremium(session)) {
      return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const questions = category
      ? await getSimulationQuestionsByCategory(category)
      : await getSimulationQuestionsMixed();

    const timeLimit = 45;
    const passRate = 75;

    return NextResponse.json({
      id: category ? `simulation-${category}` : "simulation-mixed",
      slug: category ? `simulation-${category}` : "simulation-mixed",
      title: category
        ? `Simulation Exam: ${category}`
        : "Simulation Exam: Mixed Categories",
      description: category
        ? `20 random questions from ${category}`
        : "20 random questions from all categories",
      questionCount: questions.length,
      timeLimit,
      passRate,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options as string[] | undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty,
      })),
    });
  } catch (e) {
    console.error("[api/simulations]", e);
    return NextResponse.json(
      { error: "Failed to fetch simulation" },
      { status: 500 }
    );
  }
}
