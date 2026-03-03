"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shuffle, ChevronRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  quizCount: number;
  color: string;
};

export default function SimulationCatalog({
  categories = [],
}: {
  categories?: Category[];
}) {
  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Simulation Exams
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Full exam simulations with 20 questions. Choose mixed categories for a
          realistic test, or focus on a single category.
        </p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/simulation/play"
            className="flex items-center gap-4 p-6 rounded-xl border-2 border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shuffle className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                Mixed Categories
              </h2>
              <p className="text-sm text-muted-foreground">
                20 random questions from all categories. Simulates the real exam
                format.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0" />
          </Link>
        </motion.div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            20 Questions Per Category
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(categories ?? []).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (i + 1) }}
              >
                <Link
                  href={`/simulation/${cat.id}/play`}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all group"
                >
                  <span className="text-2xl shrink-0">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      20 questions · 45 min
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
