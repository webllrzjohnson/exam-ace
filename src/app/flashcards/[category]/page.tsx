import { getFlashcardsByCategory } from "@/lib/queries/flashcard";
import { getFlashcardSetsMeta } from "@/lib/queries/flashcard";
import { notFound } from "next/navigation";
import FlashcardPlayer from "@/components/FlashcardPlayer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const sets = await getFlashcardSetsMeta();
  const set = sets.find((s) => s.id === category);
  return {
    title: set ? `${set.name} Flashcards | Canadian Citizenship` : "Flashcards | Canadian Citizenship",
    description: set ? `Study ${set.cardCount} flashcards for ${set.name}` : "Study citizenship flashcards",
  };
}

export default async function FlashcardCategoryPage({ params }: Props) {
  const { category } = await params;
  const [cards, sets] = await Promise.all([
    getFlashcardsByCategory(category),
    getFlashcardSetsMeta(),
  ]);

  const set = sets.find((s) => s.id === category);
  if (!cards || !set) notFound();

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link
        href="/flashcards"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Flashcards
      </Link>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <span>{set.icon}</span>
          {set.name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {cards.length} cards
        </p>
      </div>
      <FlashcardPlayer cards={cards} />
    </div>
  );
}
