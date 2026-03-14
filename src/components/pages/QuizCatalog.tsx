"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Lock, BookOpen, Layers } from "lucide-react";

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

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  quizCount: number;
  color: string;
};

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 50] as const;

export default function QuizCatalog() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [questionCount, setQuestionCount] = useState(20);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const tier = getUserTier(session);
  const maxQuestions = getMaxQuestions(tier);

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

  const filtered = quizzes.filter(
    (q) => selectedCategory === "all" || q.category === selectedCategory
  );

  const featuredQuiz = filtered.find((q) => q.id === "advanced-citizenship");
  const regularQuizzes = filtered.filter((q) => q.id !== "advanced-citizenship");

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-12 px-6">
          <div className="max-w-5xl mx-auto animate-pulse space-y-3">
            <div className="h-9 bg-muted rounded-lg w-48" />
            <div className="h-5 bg-muted rounded w-72" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-b from-primary/8 via-primary/4 to-transparent border-b border-border/50">
        <div className="container py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wide uppercase">Exam Practice</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground">Quiz Catalog</h1>
              <p className="text-muted-foreground mt-1.5">
                Pick a topic and start practicing at your own pace
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm self-start sm:self-auto">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{quizzes.length} quizzes</span>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border",
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              All topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border",
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-8 min-w-0">
            {/* Question count picker */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="shrink-0">
                <p className="text-sm font-semibold text-foreground">Questions per quiz</p>
                {maxQuestions !== null && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Free tier: up to {maxQuestions}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                {QUESTION_COUNTS.map((n) => {
                  const isDisabled = maxQuestions !== null && n > maxQuestions;
                  const isSelected = questionCount === n;
                  return (
                    <button
                      key={n}
                      onClick={() => !isDisabled && setQuestionCount(n)}
                      disabled={isDisabled}
                      className={cn(
                        "relative inline-flex items-center gap-1 w-12 justify-center py-1.5 rounded-lg text-sm font-medium border transition-all duration-150",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : isDisabled
                          ? "bg-muted/50 text-muted-foreground border-border opacity-50 cursor-not-allowed"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {n}
                      {isDisabled && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-muted-foreground" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured quiz */}
            {featuredQuiz && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Featured challenge
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <QuizCard quiz={featuredQuiz} variant="featured" />
                </div>
              </section>
            )}

            {/* Quiz grid */}
            <section>
              {featuredQuiz && (
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    All quizzes
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {regularQuizzes.length} available
                  </span>
                </div>
              )}

              {regularQuizzes.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {regularQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} questionCount={questionCount} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-border text-muted-foreground">
                  <BookOpen className="w-10 h-10 mb-3 opacity-30" />
                  <p className="font-medium">No quizzes in this category</p>
                  <p className="text-sm mt-1 opacity-70">Try selecting a different topic above</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            <DidYouKnow count={1} />
          </aside>
        </div>
      </div>
    </div>
  );
}
