import ReviewPage from "@/pages/ReviewPage";

export default function QuizReviewRoute({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ReviewPage id={id} />;
}
