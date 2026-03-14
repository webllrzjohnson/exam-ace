import { getCategories } from "@/lib/queries/quiz";
import SimulationCatalog from "@/components/pages/SimulationCatalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Simulation Exams | Canadian Citizenship",
  description: "Practice with full simulation exams - mixed or by category",
};

export default async function SimulationPage() {
  const categories = await getCategories();
  return <SimulationCatalog categories={categories} />;
}
