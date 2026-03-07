"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type Props = {
  cards: Flashcard[];
};

export default function FlashcardPlayer({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = cards[index];
  const hasPrev = index > 0;
  const hasNext = index < cards.length - 1;

  const goPrev = () => {
    if (hasPrev) {
      setIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };

  const goNext = () => {
    if (hasNext) {
      setIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const reset = () => {
    setIndex(0);
    setIsFlipped(false);
  };

  if (cards.length === 0) return null;

  return (
    <div className="space-y-6">
      <div
        className="relative aspect-[4/3] min-h-[280px] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped((f) => !f)}
      >
        <motion.div
          className="absolute inset-0 preserve-3d"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <div
            className="absolute inset-0 backface-hidden rounded-xl border border-border bg-card shadow-card p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <p className="text-sm text-muted-foreground mb-2">Question</p>
            <p className="text-lg font-medium text-foreground leading-relaxed">{card.front}</p>
            <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
          </div>
          <div
            className="absolute inset-0 backface-hidden rounded-xl border border-border bg-primary/5 shadow-card p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-sm text-muted-foreground mb-2">Answer</p>
            <div className="text-lg font-medium text-foreground leading-relaxed whitespace-pre-line">
              {card.back}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Click to flip back</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            hasPrev ? "bg-muted hover:bg-muted/80 text-foreground" : "bg-muted/50 text-muted-foreground cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={goNext}
          disabled={!hasNext}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            hasNext ? "bg-muted hover:bg-muted/80 text-foreground" : "bg-muted/50 text-muted-foreground cursor-not-allowed"
          )}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setIsFlipped(false);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i === index ? "bg-primary" : "bg-muted hover:bg-muted-foreground/30"
            )}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
