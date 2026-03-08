import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const ImportQuestionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("single"),
    question: z.string().min(1),
    options: z.array(z.string()).min(1),
    correctAnswer: z.string().min(1),
    explanation: z.string().min(1),
    topic: z.string().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
  }),
  z.object({
    type: z.literal("multiple"),
    question: z.string().min(1),
    options: z.array(z.string()).min(1),
    correctAnswer: z.array(z.string()).min(1),
    explanation: z.string().min(1),
    topic: z.string().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
  }),
  z.object({
    type: z.literal("boolean"),
    question: z.string().min(1),
    options: z.array(z.string()).optional(),
    correctAnswer: z.enum(["True", "False"]),
    explanation: z.string().min(1),
    topic: z.string().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
  }),
  z.object({
    type: z.literal("fill"),
    question: z.string().min(1),
    correctAnswer: z.string().min(1),
    explanation: z.string().min(1),
    topic: z.string().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
  }),
  z.object({
    type: z.literal("matching"),
    question: z.string().min(1),
    matchPairs: z.array(z.object({ left: z.string(), right: z.string() })).min(1),
    explanation: z.string().min(1),
    topic: z.string().min(1),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
  }),
]);

const ImportSchema = z.object({
  quizId: z.string().min(1),
  questions: z.array(ImportQuestionSchema).min(1).max(2000),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = ImportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { id: parsed.data.quizId },
    });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const created = await db.$transaction(
      parsed.data.questions.map((q) => {
        const base = {
          quizId: parsed.data.quizId,
          type: q.type,
          question: q.question,
          explanation: q.explanation,
          topic: q.topic,
          difficulty: q.difficulty,
        };

        if (q.type === "matching") {
          return db.question.create({
            data: {
              ...base,
              options: null,
              correctAnswer: q.matchPairs as unknown as object,
              matchPairs: q.matchPairs as unknown as object,
            },
          });
        }

        if (q.type === "boolean") {
          return db.question.create({
            data: {
              ...base,
              options: q.options ?? ["True", "False"],
              correctAnswer: q.correctAnswer as unknown as object,
              matchPairs: null,
            },
          });
        }

        if (q.type === "fill") {
          return db.question.create({
            data: {
              ...base,
              options: null,
              correctAnswer: q.correctAnswer as unknown as object,
              matchPairs: null,
            },
          });
        }

        return db.question.create({
          data: {
            ...base,
            options: q.options,
            correctAnswer: q.correctAnswer as unknown as object,
            matchPairs: null,
          },
        });
      })
    );

    return NextResponse.json({
      imported: created.length,
      ids: created.map((c) => c.id),
    });
  } catch (e) {
    console.error("[api/questions/import POST]", e);
    return NextResponse.json(
      { error: "Failed to import questions" },
      { status: 500 }
    );
  }
}
