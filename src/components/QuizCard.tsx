import Link from "next/link";
import { Clock, HelpCircle, Sparkles, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import DifficultyBadge from "./DifficultyBadge";

type Quiz = {
  id: string;
  title: string;
  description: string;
  categoryIcon: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  passRate: number;
};

export default function QuizCard({
  quiz,
  variant,
  questionCount,
}: {
  quiz: Quiz;
  variant?: "default" | "featured";
  questionCount?: number;
}) {
  const isFeatured = variant === "featured";
  const href = questionCount ? `/quiz/${quiz.id}?count=${questionCount}` : `/quiz/${quiz.id}`;
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-xl border p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5",
        isFeatured
          ? "border-primary/50 bg-gradient-to-br from-primary/5 via-card to-primary/10 ring-2 ring-primary/20"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{quiz.categoryIcon}</span>
        <div className="flex items-center gap-2">
          {isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="w-3 h-3" />
              Hard Mode
            </span>
          )}
          <DifficultyBadge difficulty={quiz.difficulty as "Easy" | "Medium" | "Hard"} />
        </div>
      </div>
      <h3 className="font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {quiz.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{quiz.description}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          {isFeatured ? "5–50 questions" : `${quiz.questionCount} questions`}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {isFeatured ? "Custom" : `${quiz.timeLimit} min`}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {quiz.passRate}% pass
        </span>
      </div>
    </Link>
  );
}
