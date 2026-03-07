import { getLeaderboard } from "@/lib/queries/quiz-attempt";
import LeaderboardPage from "@/pages/LeaderboardPage";

export const metadata = {
  title: "Leaderboard | Canadian Citizenship",
};

export default async function Leaderboard() {
  const data = await getLeaderboard(10);
  return <LeaderboardPage data={data} />;
}
