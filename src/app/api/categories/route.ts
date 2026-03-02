import { NextResponse } from "next/server";
import { getCategories } from "@/lib/queries/quiz";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (e) {
    console.error("[api/categories]", e);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
