"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, RotateCcw, ArrowRight } from "lucide-react";
import { setQuizResult } from "@/lib/quiz-storage";
import { shuffleArray } from "@/lib/utils";
import { ProgressTracker } from "@/components/quiz/progress-tracker";
import { Button } from "@/components/ui/button";

type MatchPair = { left: string; right: string };

type Question = {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  matchPairs?: MatchPair[];
  explanation: string;
  topic: string;
  difficulty: string;
};

type Simulation = {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number;
};

export default function SimulationPlayer({
  category,
}: {
  category?: string;
}) {
  const router = useRouter();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | MatchPair[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [fillAnswer, setFillAnswer] = useState("");
  const [matchingSelections, setMatchingSelections] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [finished, setFinished] = useState(false);

  const fetchUrl = category
    ? `/api/simulations?category=${encodeURIComponent(category)}`
    : "/api/simulations";

  useEffect(() => {
    fetch(fetchUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSimulation(data);
          setTimeLeft(data.timeLimit * 60);
          setStartTime(Date.now());
        }
      })
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  const questions = simulation?.questions ?? [];
  const total = questions.length;
  const question = questions[currentIndex];

  const handleFinish = useCallback(() => {
    if (finished || !simulation || !question) return;
    setFinished(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const finalAnswers = { ...answers };
    if (!finalAnswers[question.id]) {
      if (question.type === "fill") {
        finalAnswers[question.id] = fillAnswer.trim();
      } else if (question.type === "multiple") {
        finalAnswers[question.id] = selectedOptions;
      } else if (question.type === "matching" && question.matchPairs) {
        finalAnswers[question.id] = question.matchPairs.map((p, i) => ({
          left: p.left,
          right: matchingSelections[i] ?? "",
        }));
      } else if (selectedOptions.length > 0) {
        finalAnswers[question.id] = selectedOptions[0];
      }
    }
    setQuizResult({
      quizId: simulation.id,
      answers: finalAnswers,
      timeTaken,
      mode: "simulation",
      questions,
    });
    router.push(`/quiz/${simulation.id}/results`);
  }, [
    answers,
    fillAnswer,
    selectedOptions,
    question,
    router,
    simulation,
    startTime,
    finished,
    questions,
  ]);

  useEffect(() => {
    if (!simulation) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [simulation, handleFinish]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOptions([]);
    setFillAnswer("");
    setMatchingSelections({});
    setTimeLeft(simulation!.timeLimit * 60);
    setStartTime(Date.now());
    setFinished(false);
  };

  const handleSubmitAnswer = () => {
    if (question.type === "fill") {
      setAnswers((prev) => ({ ...prev, [question.id]: fillAnswer.trim() }));
    } else if (question.type === "multiple") {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedOptions }));
    } else if (question.type === "matching" && question.matchPairs) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: question.matchPairs.map((p, i) => ({ left: p.left, right: matchingSelections[i] ?? "" })),
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedOptions[0] }));
    }
    goNext();
  };

  const goNext = () => {
    setSelectedOptions([]);
    setFillAnswer("");
    setMatchingSelections({});
    if (currentIndex + 1 >= total) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleOption = (opt: string) => {
    if (question.type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
      );
    } else {
      setSelectedOptions([opt]);
    }
  };

  const canSubmit =
    question?.type === "fill"
      ? fillAnswer.trim().length > 0
      : question?.type === "matching" && question?.matchPairs
        ? question.matchPairs.every((_, i) => !!matchingSelections[i])
        : selectedOptions.length > 0;

  const matchingRightOptions = useMemo(() => {
    if (question?.type !== "matching" || !question?.matchPairs) return [];
    return shuffleArray(question.matchPairs.map((p) => p.right));
  }, [question?.id, question?.type, question?.matchPairs]);
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading || !simulation) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!question) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        No questions available.
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="sticky top-16 z-40 bg-card border-b border-border">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/simulation"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              All Tests
            </Link>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentIndex + 1} / {total}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <aside className="space-y-6 order-2 lg:order-1">
            <ProgressTracker
              total={total}
              currentIndex={currentIndex}
              answers={answers}
              questions={questions}
              onQuestionSelect={goToQuestion}
            />
          </aside>

          <main className="order-1 lg:order-2 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-8 leading-relaxed">
                {question.question}
              </h2>

              {question.type === "fill" ? (
                <input
                  type="text"
                  value={fillAnswer}
                  onChange={(e) => setFillAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-5 py-4 rounded-xl border-2 border-input bg-card text-foreground text-lg font-medium focus:outline-none focus:border-primary transition-colors"
                  onKeyDown={(e) =>
                    e.key === "Enter" && canSubmit && handleSubmitAnswer()
                  }
                />
              ) : question.type === "matching" && question.matchPairs ? (
                <div className="space-y-4">
                  {question.matchPairs.map((pair, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border-2 border-border bg-card"
                    >
                      <span className="font-medium text-foreground shrink-0 sm:w-48">{pair.left}</span>
                      <span className="hidden sm:inline text-muted-foreground">→</span>
                      <select
                        value={matchingSelections[i] ?? ""}
                        onChange={(e) => setMatchingSelections((prev) => ({ ...prev, [i]: e.target.value }))}
                        className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select match...</option>
                        {matchingRightOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {question.options?.map((opt, i) => {
                    const isSelected = selectedOptions.includes(opt);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleOption(opt)}
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all flex items-center gap-3 ${
                          isSelected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/40"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30 text-muted-foreground"
                          }`}
                        >
                          {isSelected ? "✓" : ""}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button
                  variant="action"
                  onClick={handleSubmitAnswer}
                  disabled={!canSubmit}
                  className="gap-2"
                >
                  Submit Answer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
