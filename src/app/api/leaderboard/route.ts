import { z } from "zod";

import { getLeaderboard } from "@/lib/queries/quiz-attempt";

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

  const data = await getLeaderboard(parsed.data.limit);
  return Response.json({ data }, { status: 200 });
}
