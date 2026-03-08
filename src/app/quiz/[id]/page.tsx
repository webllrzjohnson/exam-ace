import QuizDetail from "@/pages/QuizDetail";

export default function QuizDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { count?: string };
}) {
  const { id } = params;
  const count = searchParams.count;
  return <QuizDetail id={id} countFromCatalog={count} />;
}
