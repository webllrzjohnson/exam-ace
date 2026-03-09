import { z } from "zod";

import { getLeaderboard } from "@/lib/queries/quiz-attempt";
import { auth } from "@/lib/auth";
import { canAccessFeature, getUserTier } from "@/lib/access-control";

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export async function GET(req: Request): Promise<Response> {
  const session = await auth();
  const tier = getUserTier(session);
  
  if (!canAccessFeature(tier, "canAccessLeaderboard")) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

  const data = await getLeaderboard(parsed.data.limit);
  return Response.json({ data }, { status: 200 });
}
