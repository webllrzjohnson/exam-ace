"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, RotateCcw, Home, Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isFillAnswerCorrect, isMatchingAnswerCorrect } from "@/lib/utils";
import { getQuizResult, clearQuizResult, setQuizReview } from "@/lib/quiz-storage";
import { canAccessFeature, getUserTier } from "@/lib/access-control";

type MatchPair = { left: string; right: string };

type Question = {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | MatchPair[];
  explanation: string;
  topic: string;
  difficulty: string;
};

export default function ResultsPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [quiz, setQuiz] = useState<{ questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | MatchPair[]>>({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [mode, setMode] = useState("practice");
  const [loading, setLoading] = useState(true);
  const savedRef = useRef(false);

  useEffect(() => {
    const result = getQuizResult();
    if (!result || (result.quizId && result.quizId !== id)) {
      router.replace(id.startsWith("simulation") ? "/simulation" : `/quiz/${id}`);
      return;
    }
    setAnswers(result.answers);
    setTimeTaken(result.timeTaken);
    setMode(result.mode);

    if (result.questions?.length) {
      setQuiz({ questions: result.questions });
      setLoading(false);
    } else {
      fetch(`/api/quizzes/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then(setQuiz)
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  useEffect(() => {
    if (!quiz || !session?.user || savedRef.current) return;
    const questions = quiz.questions;
    const correctCount = questions.filter((q) => {
      const ans = answers[q.id];
      if (!ans) return false;
      if (q.type === "matching") {
        const correct = q.correctAnswer as MatchPair[];
        return Array.isArray(ans) && isMatchingAnswerCorrect(ans as MatchPair[], correct);
      }
      if (Array.isArray(q.correctAnswer) && q.type === "multiple") {
        return Array.isArray(ans) && q.correctAnswer.length === ans.length && (q.correctAnswer as string[]).every((a) => (ans as string[]).includes(a));
      }
      if (q.type === "fill") {
        return typeof ans === "string" && isFillAnswerCorrect(ans, q.correctAnswer as string);
      }
      return ans === q.correctAnswer;
    }).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 75;
    savedRef.current = true;
    fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: id,
        score,
        timeTaken,
        mode,
        passed,
      }),
    }).catch(() => {});
  }, [quiz, answers, timeTaken, mode, id, session?.user]);

  if (loading || !quiz) {
    return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  }

  const questions = quiz.questions;
  const correctCount = questions.filter((q) => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.type === "matching") {
      const correct = q.correctAnswer as MatchPair[];
      return Array.isArray(ans) && isMatchingAnswerCorrect(ans as MatchPair[], correct);
    }
    if (Array.isArray(q.correctAnswer) && q.type === "multiple") {
      return Array.isArray(ans) && q.correctAnswer.length === ans.length && (q.correctAnswer as string[]).every((a) => (ans as string[]).includes(a));
    }
    if (q.type === "fill") {
      return typeof ans === "string" && isFillAnswerCorrect(ans, q.correctAnswer as string);
    }
    return ans === q.correctAnswer;
  }).length;

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 75;
  const incorrectCount = questions.length - correctCount;
  const wrongQuestions = questions.filter((q) => {
    const ans = answers[q.id];
    if (!ans) return true;
    if (q.type === "matching") {
      const correct = q.correctAnswer as MatchPair[];
      return !(Array.isArray(ans) && isMatchingAnswerCorrect(ans as MatchPair[], correct));
    }
    if (Array.isArray(q.correctAnswer) && q.type === "multiple") {
      return !(Array.isArray(ans) && q.correctAnswer.length === ans.length && (q.correctAnswer as string[]).every((a) => (ans as string[]).includes(a)));
    }
    if (q.type === "fill") {
      return typeof ans !== "string" || !isFillAnswerCorrect(ans, q.correctAnswer as string);
    }
    return ans !== q.correctAnswer;
  });

  const topicMap = new Map<string, { correct: number; total: number }>();
  questions.forEach((q) => {
    const entry = topicMap.get(q.topic) || { correct: 0, total: 0 };
    entry.total++;
    const ans = answers[q.id];
    if (ans) {
      const isCorrect =
        q.type === "matching"
          ? Array.isArray(ans) && isMatchingAnswerCorrect(ans as MatchPair[], q.correctAnswer as MatchPair[])
          : Array.isArray(q.correctAnswer) && q.type === "multiple"
            ? Array.isArray(ans) && q.correctAnswer.length === ans.length && (q.correctAnswer as string[]).every((a) => (ans as string[]).includes(a))
            : q.type === "fill"
              ? typeof ans === "string" && isFillAnswerCorrect(ans, q.correctAnswer as string)
              : ans === q.correctAnswer;
      if (isCorrect) entry.correct++;
    }
    topicMap.set(q.topic, entry);
  });

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const canReview = canAccessFeature(getUserTier(session), "canAccessReview");

  const handleReview = (showAll = false) => {
    if (!canReview) return;
    setQuizReview({
      answers,
      wrongQuestions: showAll ? questions : wrongQuestions,
      showAll,
    });
    clearQuizResult();
    router.push(`/quiz/${id}/review`);
  };

  const handleNavigate = (path: string) => {
    clearQuizResult();
    router.push(path);
  };

  return (
    <div className="container max-w-2xl py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4 ${
              passed ? "border-success" : "border-destructive"
            }`}
          >
            <div>
              <div className={`text-4xl font-display font-extrabold ${passed ? "text-success" : "text-destructive"}`}>
                {score}%
              </div>
              <div className={`text-sm font-semibold ${passed ? "text-success" : "text-destructive"}`}>
                {passed ? "PASSED" : "FAILED"}
              </div>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {passed ? "🎉 Congratulations!" : "Keep Practicing!"}
          </h1>
          <p className="text-muted-foreground">
            {passed
              ? "You passed the quiz! Great job on your preparation."
              : "You need 75% to pass. Review the topics below and try again."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-card">
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-success" />
            <div className="text-xl font-bold text-foreground">{correctCount}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-card">
            <XCircle className="w-5 h-5 mx-auto mb-2 text-destructive" />
            <div className="text-xl font-bold text-foreground">{incorrectCount}</div>
            <div className="text-xs text-muted-foreground">Incorrect</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-card">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold text-foreground">{formatTime(timeTaken)}</div>
            <div className="text-xs text-muted-foreground">Time Taken</div>
          </div>
        </div>

        {!session?.user && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Create a free account to save your progress
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Premium members get flashcards, simulation exams, custom question counts, instant feedback, and more.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:underline"
                >
                  Sign up free
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
          <h2 className="font-display font-bold text-foreground mb-4">Topic Breakdown</h2>
          <div className="space-y-3">
            {Array.from(topicMap.entries()).map(([topic, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{topic}</span>
                    <span className="text-muted-foreground">
                      {data.correct}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {wrongQuestions.length > 0 && (
            <Button
              variant="action"
              onClick={() => handleReview(false)}
              disabled={!canReview}
              title={!canReview ? "Upgrade to Premium to review answers" : undefined}
              className="flex-1 min-w-[140px] gap-2"
            >
              <Eye className="w-4 h-4" />
              Review Wrong Answers
              {!canReview && <Crown className="w-4 h-4" />}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleReview(true)}
            disabled={!canReview}
            title={!canReview ? "Upgrade to Premium to review answers" : undefined}
            className={`flex-1 min-w-[140px] gap-2 rounded-xl py-3 font-semibold ${
              canReview
                ? "border-primary text-primary hover:bg-primary/10"
                : "opacity-60 cursor-not-allowed"
            }`}
          >
            <Eye className="w-4 h-4" />
            Review All Answers
            {!canReview && <Crown className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              handleNavigate(id.startsWith("simulation") ? "/simulation" : `/quiz/${id}`)
            }
            className="flex-1 gap-2 rounded-xl py-3 font-semibold border-border bg-card hover:bg-muted"
          >
            <RotateCcw className="w-4 h-4" />
            {id.startsWith("simulation") ? "Back to Simulations" : "Retry Quiz"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNavigate("/")}
            className="flex-1 gap-2 rounded-xl py-3 font-semibold border-border bg-card hover:bg-muted"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
