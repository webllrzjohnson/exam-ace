import { getFlashcardSetsMeta } from "@/lib/queries/flashcard";
import FlashcardsPage from "@/components/pages/FlashcardsPage";

export const metadata = {
  title: "Flashcards | Canadian Citizenship",
  description: "Use flashcards to reinforce what you have learned. Active recall helps strengthen memory and improve long-term retention.",
};

export default async function FlashcardsRoute() {
  const sets = await getFlashcardSetsMeta();
  const allSet = sets.find((s) => s.id === "all");
  const totalCards = allSet ? allSet.cardCount : sets.reduce((sum, s) => sum + s.cardCount, 0);
  const firstSetWithCards = sets.find((s) => s.cardCount > 0);

  return (
    <FlashcardsPage
      sets={sets}
      totalCards={totalCards}
      nextUpSlug={firstSetWithCards?.id ?? null}
    />
  );
}
