import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    const question = await db.question.findUnique({
      where: { id },
    });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...question,
      options: question.options as string[] | undefined,
      correctAnswer: question.correctAnswer,
      matchPairs: question.matchPairs as { left: string; right: string }[] | undefined,
    });
  } catch (e) {
    console.error("[api/questions GET]", e);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}

const UpdateQuestionSchema = z.object({
  type: z.enum(["single", "multiple", "boolean", "fill", "matching"]).optional(),
  question: z.string().min(1).optional(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  matchPairs: z.array(z.object({ left: z.string(), right: z.string() })).optional(),
  explanation: z.string().min(1).optional(),
  topic: z.string().min(1).optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.correctAnswer !== undefined) {
      updateData.correctAnswer = parsed.data.correctAnswer as object;
    }
    if (parsed.data.matchPairs !== undefined) {
      updateData.matchPairs = parsed.data.matchPairs as object;
    }
    const question = await db.question.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(question);
  } catch (e) {
    console.error("[api/questions PATCH]", e);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    await db.question.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/questions DELETE]", e);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
