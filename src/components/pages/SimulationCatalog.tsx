"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Shuffle, ChevronRight, Crown, Lock } from "lucide-react";
import { getUserTier, canAccessFeature } from "@/lib/access-control";
import { cn } from "@/lib/utils";

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
  const { data: session } = useSession();
  const tier = getUserTier(session);
  const canAccess = canAccessFeature(tier, "canAccessSimulations");

  return (
    <div className="container py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Simulation Exams
          </h1>
          {!canAccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 font-semibold text-sm">
              <Crown className="w-3.5 h-3.5" />
              Premium
            </span>
          )}
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Full exam simulations with 20 questions. Choose mixed categories for a
          realistic test, or focus on a single category.
        </p>
        {!canAccess && (
          <div className="mt-4">
            <Link
              href="/upgrade"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Access Simulations
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={canAccess ? "/simulation/play" : "/upgrade"}
            className={cn(
              "flex items-center gap-4 p-6 rounded-xl border-2 border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all group",
              !canAccess && "opacity-60"
            )}
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shuffle className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  Mixed Categories
                </h2>
                {!canAccess && <Lock className="w-4 h-4 text-amber-500" />}
              </div>
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
                  href={canAccess ? `/simulation/${cat.id}/play` : "/upgrade"}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all group",
                    !canAccess && "opacity-60"
                  )}
                >
                  <span className="text-2xl shrink-0">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      {!canAccess && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
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
