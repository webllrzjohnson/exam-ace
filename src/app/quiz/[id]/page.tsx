import QuizDetail from "@/pages/QuizDetail";

export default function QuizDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <QuizDetail id={id} />;
}
