"use client";

import Link from "next/link";
import { Crown, ChevronRight } from "lucide-react";

export function PremiumPromoBanner() {
  return (
    <Link
      href="/upgrade"
      className="block border-b border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 py-2 px-4 hover:from-amber-500/10 hover:to-orange-500/10 transition-colors"
    >
      <div className="container flex items-center justify-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold">
          <Crown className="w-4 h-4" />
          Premium Membership
        </span>
        <span className="text-muted-foreground">— Unlock flashcards, simulations & more</span>
        <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
      </div>
    </Link>
  );
}
