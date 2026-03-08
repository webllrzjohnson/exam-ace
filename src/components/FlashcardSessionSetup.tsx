"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFlashcardsForSession } from "@/lib/actions/flashcard";
import FlashcardPlayer from "@/components/FlashcardPlayer";
import { PRESET_COUNTS, MAX_CUSTOM_COUNT } from "@/lib/queries/flashcard";
import type { Flashcard } from "@/lib/queries/flashcard";
import { RotateCcw } from "lucide-react";

const STORAGE_KEY_PREFIX = "flashcards-last-seen-";

function getStoredExcludeIds(category: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${category}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function storeLastSeenIds(category: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${category}`, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

type Props = {
  category: string;
  displayName: string;
  availableCount: number;
  icon: string;
};

export default function FlashcardSessionSetup({ category, displayName, availableCount, icon }: Props) {
  const [selectedCount, setSelectedCount] = useState<number | "custom">(10);
  const [customCount, setCustomCount] = useState("");
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveCount =
    selectedCount === "custom"
      ? Math.min(MAX_CUSTOM_COUNT, Math.max(1, parseInt(customCount, 10) || 0))
      : selectedCount;

  const startSession = async () => {
    const count = effectiveCount;
    if (count < 1) return;

    setIsLoading(true);
    setError(null);

    const excludeIds = getStoredExcludeIds(category);
    const result = await getFlashcardsForSession(category, count, excludeIds);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (!result.data || result.data.length === 0) {
      setError("No flashcards available.");
      return;
    }

    storeLastSeenIds(category, result.data.map((c) => c.id));
    setCards(result.data);
  };

  const startNewSession = () => {
    setCards(null);
    setError(null);
  };

  if (cards && cards.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {cards.length} random cards · different from last session
          </p>
          <Button variant="ghost" size="sm" onClick={startNewSession} className="gap-1.5">
            <RotateCcw className="w-4 h-4" />
            New session
          </Button>
        </div>
        <FlashcardPlayer cards={cards} />
      </div>
    );
  }

  const maxAvailable = Math.min(availableCount, MAX_CUSTOM_COUNT);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <h3 className="font-display font-bold text-foreground mb-1">How many cards?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a preset or enter a custom number (max {MAX_CUSTOM_COUNT}). Questions are random and
          different from your last session.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_COUNTS.filter((n) => n <= maxAvailable).map((n) => (
            <Button
              key={n}
              variant={selectedCount === n ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCount(n)}
            >
              {n}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={selectedCount === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCount("custom")}
          >
            Custom
          </Button>
          {selectedCount === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={MAX_CUSTOM_COUNT}
                placeholder={`1–${MAX_CUSTOM_COUNT}`}
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">max {MAX_CUSTOM_COUNT}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          {availableCount} cards available in {displayName}
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        onClick={startSession}
        disabled={isLoading || effectiveCount < 1}
        className="w-full sm:w-auto"
      >
        {isLoading ? "Loading…" : `Start with ${effectiveCount} cards`}
      </Button>
    </div>
  );
}
