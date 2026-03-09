import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const count = parseInt(searchParams.get("count") || "3", 10)
    const category = searchParams.get("category")

    const totalFacts = await db.fact.count({
      where: category ? { category } : undefined,
    })

    if (totalFacts === 0) {
      return NextResponse.json({ data: [] })
    }

    const skip = Math.max(0, Math.floor(Math.random() * (totalFacts - count)))

    const facts = await db.fact.findMany({
      where: category ? { category } : undefined,
      skip,
      take: count,
      select: {
        id: true,
        fact: true,
        category: true,
        source: true,
        sourceUrl: true,
      },
    })

    return NextResponse.json({ data: facts })
  } catch (error) {
    console.error("[GET /api/facts]", error)
    return NextResponse.json({ error: "Failed to fetch facts" }, { status: 500 })
  }
}
