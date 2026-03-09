import { z } from "zod";

import { auth } from "@/lib/auth";
import { saveQuizAttempt, type SaveQuizAttemptInput } from "@/lib/actions/quiz-attempt";
import { canTakeQuiz, incrementDailyAttempts } from "@/lib/queries/daily-limit";

const BodySchema = z.object({
  quizId: z.string().min(1),
  score: z.number().min(0).max(100),
  timeTaken: z.number().min(0),
  mode: z.string().min(1),
  passed: z.boolean(),
});

export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const accessCheck = await canTakeQuiz(session);
  if (!accessCheck.allowed && accessCheck.reason === "daily_limit_exceeded") {
    return Response.json(
      {
        error: "Daily limit exceeded",
        attemptsUsed: accessCheck.attemptsUsed,
        attemptsLimit: accessCheck.attemptsLimit,
      },
      { status: 403 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

  const result = await saveQuizAttempt(parsed.data as SaveQuizAttemptInput);
  if (!result.success) {
    return Response.json({ error: result.error ?? "Failed to save" }, { status: 500 });
  }

  await incrementDailyAttempts(session.user.id);

  return Response.json({ data: { saved: true } }, { status: 201 });
}
