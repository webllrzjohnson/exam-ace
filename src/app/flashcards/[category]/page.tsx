import { getFlashcardSetsMeta } from "@/lib/queries/flashcard";
import { notFound, redirect } from "next/navigation";
import FlashcardSessionSetup from "@/components/FlashcardSessionSetup";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { isPremium } from "@/lib/access-control";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const sets = await getFlashcardSetsMeta();
  const set = sets.find((s) => s.id === category);
  const name = set?.name ?? (category === "all" ? "All Topics" : "Flashcards");
  const count = set?.cardCount ?? 0;
  return {
    title: `${name} Flashcards | Canadian Citizenship`,
    description: count > 0 ? `Study ${count} flashcards for ${name}` : "Study citizenship flashcards",
  };
}

export default async function FlashcardCategoryPage({ params }: Props) {
  const session = await auth();
  if (!isPremium(session)) {
    redirect("/upgrade");
  }

  const { category } = await params;
  const sets = await getFlashcardSetsMeta();
  const set = sets.find((s) => s.id === category);
  const displaySet = set ?? (category === "all" ? { name: "All Topics", icon: "📚" } : null);
  if (!displaySet) notFound();

  const availableCount = set?.cardCount ?? (category === "all" ? sets.reduce((s, x) => s + x.cardCount, 0) : 0);
  if (availableCount === 0) notFound();

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
          <span>{displaySet.icon}</span>
          {displaySet.name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {availableCount} cards available
        </p>
      </div>
      <FlashcardSessionSetup
        category={category}
        displayName={displaySet.name}
        availableCount={availableCount}
        icon={displaySet.icon}
      />
    </div>
  );
}
