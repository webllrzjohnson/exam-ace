import ResultsPage from "@/components/pages/ResultsPage";

export default async function QuizResultsRoute({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ResultsPage id={id} />;
}
