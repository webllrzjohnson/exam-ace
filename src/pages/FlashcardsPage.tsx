"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, ArrowRight, BookOpen } from "lucide-react";

type FlashcardSetMeta = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  cardCount: number;
};

type Props = {
  sets?: FlashcardSetMeta[];
  totalCards?: number;
  nextUpSlug?: string | null;
};

export default function FlashcardsPage({ sets = [], totalCards = 0, nextUpSlug = null }: Props) {
  const setsWithCards = sets.filter((s) => s.cardCount > 0);

  return (
    <div>
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="container relative py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Layers className="w-4 h-4" />
              Flashcards
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gradient">
              Start Your Citizenship Test Preparation
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 opacity-95">
              Canadian Citizenship Preparation
            </h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              Use flashcards to go beyond multiple-choice questions and reinforce what you have learned. Flashcards support active recall, a proven learning method that helps strengthen memory and improve long-term retention.
            </p>
            <p className="text-sm opacity-80 mb-8">
              Based on the official Discover Canada study guide
            </p>
            {nextUpSlug && (
              <Link
                href={`/flashcards/${nextUpSlug}`}
                className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
              >
                Next Up: {sets.find((s) => s.id === nextUpSlug)?.name ?? "Flashcards"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              Challenge yourself with flashcards
            </h2>
            <p className="text-muted-foreground">
              {setsWithCards.length} sets, {totalCards} cards
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {setsWithCards.map((set, i) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/flashcards/${set.id}`}
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"
              >
                <span className="text-3xl">{set.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {set.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {set.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <BookOpen className="w-3.5 h-3.5" />
                    {set.cardCount} Flashcards
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {setsWithCards.length === 0 && (
          <div className="text-center py-16 text-muted-foreground rounded-xl border border-dashed border-border">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No flashcards available yet.</p>
            <p className="text-sm mt-1">Add quizzes with questions to see flashcards here.</p>
          </div>
        )}
      </section>

      <section className="container pb-16">
        <div className="rounded-xl border border-border bg-muted/30 p-6 md:p-8">
          <h3 className="font-display font-bold text-foreground mb-2">How to use flashcards</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Select a chapter above to start. Each card shows a question on the front—try to recall the answer before flipping. The back reveals the correct answer and explanation. Work through a set to reinforce key concepts from the citizenship test.
          </p>
        </div>
      </section>
    </div>
  );
}
