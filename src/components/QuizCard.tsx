import Link from "next/link";
import { Clock, HelpCircle, TrendingUp } from "lucide-react";
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

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="group block rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{quiz.categoryIcon}</span>
        <DifficultyBadge difficulty={quiz.difficulty as "Easy" | "Medium" | "Hard"} />
      </div>
      <h3 className="font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {quiz.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{quiz.description}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          {quiz.questionCount} questions
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {quiz.timeLimit} min
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {quiz.passRate}% pass
        </span>
      </div>
    </Link>
  );
}
