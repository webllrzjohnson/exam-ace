"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clock, HelpCircle, Shuffle, TrendingUp, Target, BookOpen, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DifficultyBadge from "@/components/DifficultyBadge";
import { getUserTier, getMaxQuestions } from "@/lib/access-control";

type Quiz = {
  id: string;
  title: string;
  description: string;
  categoryIcon: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  passRate: number;
  avgScore: number;
  topics: string[];
};

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 40, 50] as const;
const TIME_OPTIONS = [5, 10, 20, 30] as const;

export default function QuizDetail({ id, countFromCatalog }: { id: string; countFromCatalog?: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"practice" | "timed">("practice");
  const catalogCount = countFromCatalog ? parseInt(countFromCatalog, 10) : undefined;
  const [questionCount, setQuestionCount] = useState(catalogCount ?? 20);
  const [timeMinutes, setTimeMinutes] = useState<number | null>(30);

  const isAdvanced = id === "advanced-citizenship";
  const tier = getUserTier(session);
  const maxQuestions = getMaxQuestions(tier);
  const isGuest = tier === "guest";

  useEffect(() => {
    fetch(`/api/quizzes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setQuiz)
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = () => {
    if (isAdvanced) {
      const params = new URLSearchParams({
        mode: timeMinutes === null ? "practice" : "timed",
        count: String(questionCount),
      });
      if (timeMinutes !== null) params.set("time", String(timeMinutes));
      if (timeMinutes === null) params.set("untimed", "true");
      router.push(`/quiz/${quiz!.id}/play?${params}`);
    } else {
      const params = new URLSearchParams({ mode });
      const count = catalogCount && catalogCount >= 5 && catalogCount <= 50 ? catalogCount : undefined;
      if (count) params.set("count", String(count));
      router.push(`/quiz/${quiz!.id}/play?${params}`);
    }
  };

  if (loading) {
    return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  }
  if (!quiz) {
    return <div className="container py-20 text-center text-muted-foreground">Quiz not found.</div>;
  }

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{quiz.categoryIcon}</span>
          <DifficultyBadge difficulty={quiz.difficulty as "Easy" | "Medium" | "Hard"} />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">{quiz.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{quiz.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: HelpCircle, label: "Questions", value: isAdvanced ? "Custom" : quiz.questionCount },
          { icon: Clock, label: "Time Limit", value: isAdvanced ? "Custom" : `${quiz.timeLimit} min` },
          { icon: TrendingUp, label: "Pass Rate", value: `${quiz.passRate}%` },
          { icon: Target, label: "Avg Score", value: `${quiz.avgScore}%` },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center shadow-card">
            <s.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Topics Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {quiz.topics.map((topic) => (
            <span key={topic} className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm font-medium">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {isAdvanced ? (
        <>
          <div className="mb-8">
            <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Number of Questions
              {maxQuestions !== null && (
                <span className="text-xs font-normal text-muted-foreground">
                  (Free tier limited to {maxQuestions})
                </span>
              )}
            </h2>
            <div className="flex flex-wrap gap-2">
              {QUESTION_COUNTS.map((n) => {
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
          </div>

          <div className="mb-8">
            <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Time Limit
            </h2>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((n) => (
                <Button
                  key={n}
                  variant={timeMinutes === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeMinutes(n)}
                  className="rounded-full"
                >
                  {n} min
                </Button>
              ))}
              <Button
                variant={timeMinutes === null ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeMinutes(null)}
                className="rounded-full"
              >
                Untimed
              </Button>
            </div>
          </div>

          <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Shuffle className="w-4 h-4" />
            Questions and question types are always randomized.
          </p>
        </>
      ) : (
        <div className="mb-8">
          <h2 className="font-display font-bold text-foreground mb-3">Select Mode</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode("practice")}
              className={cn(
                "p-5 rounded-xl border-2 text-left transition-all",
                mode === "practice" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="text-lg font-bold text-foreground mb-1">📝 Practice Mode</div>
              <p className="text-sm text-muted-foreground">No time pressure. Get instant feedback after each question.</p>
            </button>
            <button
              onClick={() => setMode("timed")}
              className={cn(
                "p-5 rounded-xl border-2 text-left transition-all",
                mode === "timed" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className="text-lg font-bold text-foreground mb-1">⏱️ Timed Exam</div>
              <p className="text-sm text-muted-foreground">Simulate the real test with a countdown timer.</p>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleStart}
        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
      >
        Start Quiz →
      </button>
      {isGuest && (
        <p className="text-sm text-center text-muted-foreground mt-3">
          Sign up for a free account to save your results and track progress
        </p>
      )}
    </div>
  );
}
