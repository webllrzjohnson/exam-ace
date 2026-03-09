"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import QuizCard from "@/components/QuizCard";
import { cn } from "@/lib/utils";
import { getUserTier, getMaxQuestions } from "@/lib/access-control";
import { DidYouKnow } from "@/components/quiz/did-you-know";

type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryIcon: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  passRate: number;
  avgScore: number;
  topics: string[];
  featured: boolean;
};

type Category = { id: string; name: string; icon: string; description: string; quizCount: number; color: string };

export default function QuizCatalog() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const initialCategory = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const tier = getUserTier(session);
  const maxQuestions = getMaxQuestions(tier);
  const isLocked = maxQuestions !== null && questionCount > maxQuestions;

  useEffect(() => {
    async function load() {
      const [qRes, cRes] = await Promise.all([
        fetch("/api/quizzes"),
        fetch("/api/categories"),
      ]);
      if (qRes.ok) setQuizzes(await qRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      setLoading(false);
    }
    load();
  }, []);

  const filtered = quizzes.filter((q) => {
    const matchCat = selectedCategory === "all" || q.category === selectedCategory;
    const matchSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Quiz Catalog</h1>
        <p className="text-muted-foreground">Browse all available quizzes and start practicing</p>
      </div>

      <div className="mb-8 space-y-6">
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-input bg-card text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-full",
              selectedCategory === "all" && "shadow-sm"
            )}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "rounded-full",
                selectedCategory === cat.id && "shadow-sm"
              )}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          {filtered.some((q) => q.id === "advanced-citizenship") && (
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                Featured Challenge
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {filtered
                  .filter((q) => q.id === "advanced-citizenship")
                  .map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} variant="featured" />
                  ))}
              </div>
            </div>
          )}
          <div>
          {filtered.some((q) => q.id === "advanced-citizenship") && (
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">All Quizzes</h2>
          )}
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Number of questions
              {maxQuestions !== null && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (Free tier limited to {maxQuestions})
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {([5, 10, 15, 20, 25, 30, 50] as const).map((n) => {
                const isDisabled = maxQuestions !== null && n > maxQuestions;
                return (
                  <Button
                    key={n}
                    variant={questionCount === n ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuestionCount(n)}
                    disabled={isDisabled}
                    className={cn("rounded-full", isDisabled && "opacity-50 cursor-not-allowed")}
                  >
                    {n}
                    {isDisabled && <Lock className="w-3 h-3 ml-1" />}
                  </Button>
                );
              })}
            </div>
            {isLocked && (
              <p className="text-xs text-amber-600 mt-2">
                Upgrade to Premium to unlock custom question counts
              </p>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {filtered
              .filter((q) => q.id !== "advanced-citizenship")
              .map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} questionCount={questionCount} />
              ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No quizzes found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 h-fit">
        <DidYouKnow count={1} />
      </aside>
      </div>
    </div>
  );
}
