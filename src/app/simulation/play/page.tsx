import SimulationPlayer from "@/components/pages/SimulationPlayer";
import { auth } from "@/lib/auth";
import { isPremium } from "@/lib/access-control";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Simulation Exam: Mixed | Canadian Citizenship",
  description: "20 random questions from all categories",
};

export default async function SimulationPlayMixedPage() {
  const session = await auth();
  if (!isPremium(session)) {
    redirect("/upgrade");
  }

  return <SimulationPlayer />;
}
