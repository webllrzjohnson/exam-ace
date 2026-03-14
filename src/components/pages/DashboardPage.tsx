import Link from "next/link";
import { BarChart3, BookOpen, Target, Flame, CheckCircle, XCircle, Clock, RotateCcw, HelpCircle, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { UserProgress } from "@/lib/queries/quiz-attempt";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

type Props = { progress: UserProgress | null };

export default function DashboardPage({ progress }: Props) {
  const isLoggedIn = progress != null;
  const hasHistory = Boolean(progress?.quizCount && progress.quizCount > 0);
  const passRate =
    progress && progress.quizCount > 0
      ? Math.round(((progress.passedCount ?? 0) / progress.quizCount) * 100)
      : 0;

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
      ) : progress ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { icon: BookOpen, label: "Quizzes Taken", value: String(progress.quizCount), color: "text-primary" },
              { icon: Target, label: "Avg Score", value: progress.quizCount > 0 ? `${progress.avgScore}%` : "—", color: "text-success" },
              { icon: CheckCircle, label: "Pass Rate", value: progress.quizCount > 0 ? `${passRate}%` : "—", color: "text-success" },
              { icon: Timer, label: "Total Time", value: formatDuration(progress.totalTimeSeconds ?? 0), color: "text-primary" },
              { icon: Flame, label: "Day Streak", value: String(progress.streak), color: "text-warning" },
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
            <div className="space-y-8">
              {(progress.categoryProgress?.length ?? 0) > 0 && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-lg font-bold text-foreground mb-4">Progress by Category</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Time spent and attempts per topic to help you focus your practice.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(progress.categoryProgress ?? []).map((cat) => (
                      <Link
                        key={cat.categorySlug}
                        href={`/quizzes?category=${cat.categorySlug}`}
                        className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{cat.categoryIcon}</span>
                          <span className="font-medium text-foreground">{cat.categoryName}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            {cat.attemptCount} attempt{cat.attemptCount !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDuration(cat.totalTimeSeconds)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" />
                            {cat.avgScore}% avg
                          </span>
                          <span className="flex items-center gap-1">
                            {cat.passedCount}/{cat.attemptCount} passed
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Last: {cat.lastAttemptAt.toLocaleDateString()}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Attempts</h2>
                <div className="space-y-3">
                  {(progress.recentAttempts ?? []).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground truncate">{a.quizTitle ?? "Quiz"}</div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
                          <span>{a.completedAt.toLocaleDateString()} · {a.mode}</span>
                          {a.categoryName && <span>· {a.categoryName}</span>}
                          {a.questionCount != null && (
                            <span className="flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              {a.questionCount} questions
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="flex items-center gap-1 text-sm">
                          {a.passed ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                          <span className={a.passed ? "text-success font-semibold" : "text-destructive font-semibold"}>{a.score}%</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatDuration(a.timeTaken)}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/quiz/${a.quizId}`} className="flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5" />
                            Try again
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
