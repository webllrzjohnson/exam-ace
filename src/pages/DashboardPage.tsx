import Link from "next/link";
import { BarChart3, BookOpen, Target, Flame, CheckCircle, XCircle, Clock } from "lucide-react";

import type { UserProgress } from "@/lib/queries/quiz-attempt";

type Props = { progress: UserProgress | null };

export default function DashboardPage({ progress }: Props) {
  const isLoggedIn = progress !== null;
  const hasHistory = progress && progress.quizCount > 0;

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Your Dashboard</h1>
      <p className="text-muted-foreground mb-8">Track your progress and keep practicing</p>

      {!isLoggedIn ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center shadow-card">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Login to track your progress</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to save your scores, monitor your improvement, and compete on the leaderboard.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Log in
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: BookOpen, label: "Quizzes Taken", value: String(progress.quizCount), color: "text-primary" },
              { icon: Target, label: "Avg Score", value: progress.quizCount > 0 ? `${progress.avgScore}%` : "—", color: "text-success" },
              { icon: Flame, label: "Day Streak", value: String(progress.streak), color: "text-warning" },
              { icon: BarChart3, label: "Recent Attempts", value: String(progress.recentAttempts.length), color: "text-primary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-5 shadow-card">
                <stat.icon className={`w-5 h-5 mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {!hasHistory ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center shadow-card">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
              <h2 className="font-display text-xl font-bold text-foreground mb-2">No quiz history yet</h2>
              <p className="text-muted-foreground mb-6">Take your first quiz to start tracking your progress.</p>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Quizzes
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Attempts</h2>
              <div className="space-y-3">
                {progress.recentAttempts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate">{a.quizTitle ?? "Quiz"}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.completedAt.toLocaleDateString()} · {a.mode}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="flex items-center gap-1 text-sm">
                        {a.passed ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        <span className={a.passed ? "text-success font-semibold" : "text-destructive font-semibold"}>{a.score}%</span>
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {Math.floor(a.timeTaken / 60)}m {a.timeTaken % 60}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
