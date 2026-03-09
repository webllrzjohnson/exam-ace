import { getLeaderboard } from "@/lib/queries/quiz-attempt";
import LeaderboardPage from "@/pages/LeaderboardPage";
import { auth } from "@/lib/auth";
import { canAccessFeature, getUserTier } from "@/lib/access-control";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Leaderboard | Canadian Citizenship",
};

export default async function Leaderboard() {
  const session = await auth();
  const tier = getUserTier(session);
  
  if (!canAccessFeature(tier, "canAccessLeaderboard")) {
    if (!session?.user) {
      redirect("/login?callbackUrl=/leaderboard");
    }
    redirect("/upgrade");
  }

  const data = await getLeaderboard(10);
  return <LeaderboardPage data={data} />;
}
