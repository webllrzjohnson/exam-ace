import ResultsPage from "@/pages/ResultsPage";

export default function QuizResultsRoute({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ResultsPage id={id} />;
}
