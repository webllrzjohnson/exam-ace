import HomePage from "@/components/pages/HomePage";
import { getCategories } from "@/lib/queries/quiz";
import { getApprovedReviews } from "@/lib/queries/review";

export default async function Home() {
  const [categories, reviews] = await Promise.all([
    getCategories(),
    getApprovedReviews(20),
  ]);
  return <HomePage categories={categories} reviews={reviews} />;
}
