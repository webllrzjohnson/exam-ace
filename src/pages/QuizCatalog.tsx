"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import QuizCard from "@/components/QuizCard";
import { cn } from "@/lib/utils";

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
  const initialCategory = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

      <div className="space-y-6">
        {filtered.some((q) => q.id === "advanced-citizenship") && (
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              Featured Challenge
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered
              .filter((q) => q.id !== "advanced-citizenship")
              .map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
          </div>
        </div>
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No quizzes found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
