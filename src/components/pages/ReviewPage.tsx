"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Crown } from "lucide-react";
import { getQuizReview, clearQuizReview } from "@/lib/quiz-storage";
import { Button } from "@/components/ui/button";

type MatchPair = { left: string; right: string };

type Question = {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | MatchPair[];
  matchPairs?: MatchPair[];
  explanation: string;
  topic: string;
};

export default function ReviewPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [quiz, setQuiz] = useState<{ id: string } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | MatchPair[]>>({});
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const isSimulation = id?.startsWith("simulation") ?? false;

  useEffect(() => {
    const review = getQuizReview();
    if (!review) {
      router.replace(isSimulation ? "/simulation" : `/quiz/${id}`);
      return;
    }
    setAnswers(review.answers);
    setWrongQuestions(review.wrongQuestions);
    setShowAll(review.showAll ?? false);

    if (isSimulation) {
      setQuiz({ id });
      setLoading(false);
    } else {
      fetch(`/api/quizzes/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => (data ? setQuiz({ id: data.id }) : null))
        .finally(() => setLoading(false));
    }
  }, [id, isSimulation, router]);

  if (loading || !quiz) {
    return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  }

  const retryHref = isSimulation
    ? id === "simulation-mixed"
      ? "/simulation/play"
      : `/simulation/${id.replace("simulation-", "")}/play`
    : `/quiz/${quiz.id}`;

  const handleBack = () => {
    clearQuizReview();
    router.push(isSimulation ? "/simulation" : `/quiz/${quiz.id}`);
  };

  return (
    <div className="container max-w-2xl py-10">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {isSimulation ? "Back to simulations" : "Back to quiz"}
      </button>

      <h1 className="font-display text-2xl font-bold text-foreground mb-2">
        {showAll ? "Review All Answers" : "Review Wrong Answers"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {showAll
          ? "Review each question with the correct answer and explanation."
          : `You got ${wrongQuestions.length} question${wrongQuestions.length > 1 ? "s" : ""} wrong. Study the explanations below.`}
      </p>

      {!session?.user && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">
                Premium members get more
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Flashcards, simulation exams, custom question counts, and instant feedback during practice.
              </p>
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:underline"
              >
                Explore premium
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {wrongQuestions.map((q, i) => {
          const userAnswer = answers[q.id];
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 shadow-card"
            >
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                Question {i + 1} · {q.topic}
              </div>
              <h3 className="font-bold text-foreground mb-4">{q.question}</h3>

              {q.type === "matching" && (q.matchPairs ?? (q.correctAnswer as MatchPair[])) ? (
                <div className="space-y-2 mb-4">
                  {(q.matchPairs ?? (q.correctAnswer as MatchPair[])).map((pair: MatchPair, j: number) => {
                    const userPairs = Array.isArray(userAnswer) ? (userAnswer as MatchPair[]) : [];
                    const userRight = userPairs.find((p) => p.left === pair.left)?.right ?? "";
                    const isCorrect = userRight === pair.right;
                    return (
                      <div
                        key={j}
                        className={`flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium ${
                          isCorrect ? "border-success bg-success/10" : "border-destructive bg-destructive/10"
                        }`}
                      >
                        <span className="text-foreground">{pair.left}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className={isCorrect ? "text-success" : "text-destructive"}>
                          {userRight || "(no answer)"}
                        </span>
                        {!isCorrect && (
                          <>
                            <span className="text-muted-foreground">· Correct:</span>
                            <span className="text-success">{pair.right}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : q.options ? (
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, j) => {
                    const isCorrectOpt = Array.isArray(q.correctAnswer)
                      ? (q.correctAnswer as string[]).includes(opt)
                      : q.correctAnswer === opt;
                    const isUserAnswer = Array.isArray(userAnswer)
                      ? (userAnswer as string[]).includes(opt)
                      : userAnswer === opt;

                    return (
                      <div
                        key={j}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium ${
                          isCorrectOpt
                            ? "border-success bg-success/10 text-foreground"
                            : isUserAnswer
                              ? "border-destructive bg-destructive/10 text-foreground"
                              : "border-border text-muted-foreground"
                        }`}
                      >
                        {isCorrectOpt ? (
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        ) : isUserAnswer ? (
                          <XCircle className="w-4 h-4 text-destructive shrink-0" />
                        ) : (
                          <span className="w-4 h-4 shrink-0" />
                        )}
                        {opt}
                        {isCorrectOpt && <span className="ml-auto text-xs text-success font-semibold">Correct</span>}
                        {isUserAnswer && !isCorrectOpt && (
                          <span className="ml-auto text-xs text-destructive font-semibold">Your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mb-4 space-y-1">
                  <p className="text-sm">
                    <span className="text-destructive font-medium">Your answer:</span> {String(userAnswer || "(no answer)")}
                  </p>
                  <p className="text-sm">
                    <span className="text-success font-medium">Correct answer:</span> {String(q.correctAnswer)}
                  </p>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Button
          variant="action"
          onClick={() => {
            clearQuizReview();
            router.push(retryHref);
          }}
          className="gap-2"
        >
          {isSimulation ? "Retry Simulation" : "Retry This Quiz"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
