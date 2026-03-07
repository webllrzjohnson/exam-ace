import { NextResponse } from "next/server";
import { getFlashcardSetsMeta } from "@/lib/queries/flashcard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sets = await getFlashcardSetsMeta();
    return NextResponse.json(sets);
  } catch (e) {
    console.error("[api/flashcards]", e);
    return NextResponse.json({ error: "Failed to fetch flashcard sets" }, { status: 500 });
  }
}
