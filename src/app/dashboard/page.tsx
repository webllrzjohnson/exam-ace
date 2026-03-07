import { auth } from "@/lib/auth";
import { getUserProgress } from "@/lib/queries/quiz-attempt";
import DashboardPage from "@/pages/DashboardPage";

export const metadata = {
  title: "Dashboard | Canadian Citizenship",
};

export default async function Dashboard() {
  const session = await auth();
  const progress = session?.user?.id ? await getUserProgress(session.user.id) : null;
  return <DashboardPage progress={progress} />;
}
