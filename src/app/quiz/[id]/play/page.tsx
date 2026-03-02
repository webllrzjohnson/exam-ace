import QuizPlayer from "@/pages/QuizPlayer";

export default function QuizPlayPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { mode?: string };
}) {
  const { id } = params;
  const { mode } = searchParams;
  return <QuizPlayer id={id} mode={mode ?? "practice"} />;
}
