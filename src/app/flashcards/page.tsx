import { getFlashcardSetsMeta } from "@/lib/queries/flashcard";
import FlashcardsPage from "@/pages/FlashcardsPage";

export const metadata = {
  title: "Flashcards | Canadian Citizenship",
  description: "Use flashcards to reinforce what you have learned. Active recall helps strengthen memory and improve long-term retention.",
};

export default async function FlashcardsRoute() {
  const sets = await getFlashcardSetsMeta();
  const totalCards = sets.reduce((sum, s) => sum + s.cardCount, 0);
  const firstSetWithCards = sets.find((s) => s.cardCount > 0);

  return (
    <FlashcardsPage
      sets={sets}
      totalCards={totalCards}
      nextUpSlug={firstSetWithCards?.id ?? null}
    />
  );
}
