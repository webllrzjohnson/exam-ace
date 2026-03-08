"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type Flashcard = {
  id: string;
  front: string;
  back: string;
  answer?: string;
  explanation?: string | null;
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
  const hasStructuredBack = card.answer != null && card.explanation != null;

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
        className="relative aspect-[4/3] min-h-[300px] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped((f) => !f)}
      >
        <motion.div
          className="absolute inset-0 preserve-3d"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.45, type: "spring", stiffness: 120, damping: 18 }}
        >
          <div
            className="absolute inset-0 backface-hidden rounded-2xl border-2 border-border bg-gradient-to-br from-card to-card/95 shadow-xl p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-3">Question</span>
            <p className="text-xl font-medium text-foreground leading-relaxed max-w-lg">{card.front}</p>
            <p className="text-xs text-muted-foreground mt-6 opacity-70">Click to reveal answer</p>
          </div>
          <div
            className="absolute inset-0 backface-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/8 via-primary/5 to-background shadow-xl p-8 flex flex-col items-start justify-center text-left overflow-y-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {hasStructuredBack && card.explanation ? (
              <>
                <div className="w-full mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">Answer</span>
                  <p className="text-lg font-semibold text-foreground mt-1.5 leading-relaxed">
                    {card.answer}
                  </p>
                </div>
                <div className="w-full pt-4 border-t border-border/60">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Explanation
                  </span>
                  <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                    {card.explanation}
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-2 block">Answer</span>
                <div className="text-lg font-medium text-foreground leading-relaxed whitespace-pre-line">
                  {card.back}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-6 opacity-70 self-center">Click to flip back</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-4 px-1">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            hasPrev ? "bg-muted hover:bg-muted/80 text-foreground shadow-sm" : "bg-muted/40 text-muted-foreground cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={goNext}
          disabled={!hasNext}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            hasNext ? "bg-muted hover:bg-muted/80 text-foreground shadow-sm" : "bg-muted/40 text-muted-foreground cursor-not-allowed"
          )}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center max-h-16 overflow-y-auto">
        {cards.length <= 100 ? (
          cards.map((_, i) => (
            <button
              key={cards[i]?.id ?? i}
              onClick={() => {
                setIndex(i);
                setIsFlipped(false);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all shrink-0",
                i === index ? "bg-primary scale-110 shadow-sm" : "bg-muted hover:bg-muted-foreground/30"
              )}
              aria-label={`Go to card ${i + 1}`}
            />
          ))
        ) : (
          <div className="flex gap-1 items-center">
            {Array.from({ length: Math.min(50, cards.length) }, (_, i) => {
              const step = Math.max(1, Math.floor(cards.length / 50));
              const idx = i * step;
              const isActive = index >= idx && index < idx + step;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setIndex(Math.min(idx, cards.length - 1));
                    setIsFlipped(false);
                  }}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all shrink-0",
                    isActive ? "bg-primary scale-110 shadow-sm" : "bg-muted hover:bg-muted-foreground/30"
                  )}
                  aria-label={`Go to card ${idx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
