import SimulationPlayer from "@/components/pages/SimulationPlayer";
import { auth } from "@/lib/auth";
import { isPremium } from "@/lib/access-control";
import { redirect } from "next/navigation";

export default async function SimulationPlayCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const session = await auth();
  if (!isPremium(session)) {
    redirect("/upgrade");
  }

  return <SimulationPlayer category={params.category} />;
}
