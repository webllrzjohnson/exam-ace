import { NextResponse } from "next/server";
import { getFlashcardsByCategory } from "@/lib/queries/flashcard";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const cards = await getFlashcardsByCategory(category);
    if (!cards) {
      return NextResponse.json({ error: "Category not found or has no flashcards" }, { status: 404 });
    }
    return NextResponse.json(cards);
  } catch (e) {
    console.error("[api/flashcards/[category]]", e);
    return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });
  }
}
