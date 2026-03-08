"use server";

import { getFlashcardsByCategoryWithCount } from "@/lib/queries/flashcard";
import type { Flashcard } from "@/lib/queries/flashcard";

export async function getFlashcardsForSession(
  categorySlug: string,
  count: number,
  excludeIds: string[] = []
): Promise<{ data: Flashcard[] | null; error?: string }> {
  try {
    const cards = await getFlashcardsByCategoryWithCount(categorySlug, count, excludeIds);
    return { data: cards };
  } catch (err) {
    console.error("[getFlashcardsForSession]", err);
    return { data: null, error: "Failed to load flashcards" };
  }
}
