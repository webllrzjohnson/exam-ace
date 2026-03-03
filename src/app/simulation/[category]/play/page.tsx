import SimulationPlayer from "@/pages/SimulationPlayer";

export default function SimulationPlayCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <SimulationPlayer category={params.category} />;
}
