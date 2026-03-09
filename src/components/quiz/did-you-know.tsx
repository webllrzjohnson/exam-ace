"use client"

import { useEffect, useState } from "react"
import { Lightbulb, ExternalLink } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Fact = {
  id: string
  fact: string
  category: string
  source: string
  sourceUrl?: string
}

type DidYouKnowProps = {
  count?: number
  category?: string
}

export function DidYouKnow({ count = 1, category }: DidYouKnowProps) {
  const [facts, setFacts] = useState<Fact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (count) params.set("count", count.toString())
    if (category) params.set("category", category)

    fetch(`/api/facts?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setFacts(data.data || [])
      })
      .catch((err) => {
        console.error("Failed to fetch facts:", err)
      })
      .finally(() => setLoading(false))
  }, [count, category])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Did You Know?
        </h3>
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (facts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        Did You Know?
      </h3>
      <div className="space-y-3">
        {facts.map((fact) => (
          <Card key={fact.id} className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <p className="text-sm text-foreground leading-relaxed mb-3">{fact.fact}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                {fact.category}
              </span>
              {fact.sourceUrl ? (
                <a
                  href={fact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Source: {fact.source}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span>Source: {fact.source}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
