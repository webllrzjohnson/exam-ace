import { NextResponse } from "next/server";
import { getFlashcardsByCategory } from "@/lib/queries/flashcard";
import { auth } from "@/lib/auth";
import { isPremium } from "@/lib/access-control";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const session = await auth();
    if (!isPremium(session)) {
      return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
    }

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
