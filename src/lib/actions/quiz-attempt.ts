"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export type SaveQuizAttemptInput = {
  quizId: string;
  score: number;
  timeTaken: number;
  mode: string;
  passed: boolean;
};

export async function saveQuizAttempt(input: SaveQuizAttemptInput): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await db.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId: input.quizId,
        score: input.score,
        timeTaken: input.timeTaken,
        mode: input.mode,
        passed: input.passed,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("[saveQuizAttempt]", err);
    return { success: false, error: "Failed to save attempt" };
  }
}
