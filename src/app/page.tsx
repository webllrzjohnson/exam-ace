import HomePage from "@/components/pages/HomePage";
import { getCategories } from "@/lib/queries/quiz";

export default async function Home() {
  const categories = await getCategories();
  return <HomePage categories={categories} />;
}
