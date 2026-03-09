import ReviewPage from "@/pages/ReviewPage";

export default async function QuizReviewRoute({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ReviewPage id={id} />;
}
