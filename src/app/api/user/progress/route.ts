import { auth } from "@/lib/auth";
import { getUserProgress } from "@/lib/queries/quiz-attempt";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getUserProgress(session.user.id);
  return Response.json({ data }, { status: 200 });
}
