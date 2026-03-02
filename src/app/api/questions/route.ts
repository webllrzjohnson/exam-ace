import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const CreateQuestionSchema = z.object({
  quizId: z.string(),
  type: z.enum(["single", "multiple", "boolean", "fill", "matching"]),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  matchPairs: z.array(z.object({ left: z.string(), right: z.string() })).optional(),
  explanation: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = CreateQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const question = await db.question.create({
      data: {
        quizId: parsed.data.quizId,
        type: parsed.data.type,
        question: parsed.data.question,
        options: parsed.data.options ?? undefined,
        correctAnswer: parsed.data.correctAnswer as object,
        matchPairs: parsed.data.matchPairs as object | undefined,
        explanation: parsed.data.explanation,
        topic: parsed.data.topic,
        difficulty: parsed.data.difficulty,
      },
    });
    return NextResponse.json(question);
  } catch (e) {
    console.error("[api/questions POST]", e);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
