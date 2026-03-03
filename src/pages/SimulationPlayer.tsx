"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, RotateCcw } from "lucide-react";
import { setQuizResult } from "@/lib/quiz-storage";

type Question = {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
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
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [fillAnswer, setFillAnswer] = useState("");
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
    setTimeLeft(simulation!.timeLimit * 60);
    setStartTime(Date.now());
    setFinished(false);
  };

  const handleSubmitAnswer = () => {
    if (question.type === "fill") {
      setAnswers((prev) => ({ ...prev, [question.id]: fillAnswer.trim() }));
    } else if (question.type === "multiple") {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedOptions }));
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedOptions[0] }));
    }
    goNext();
  };

  const goNext = () => {
    setSelectedOptions([]);
    setFillAnswer("");
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
      : selectedOptions.length > 0;
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
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col lg:flex-row">
      <aside className="lg:hidden border-b border-border bg-card/50 p-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/simulation"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            All Tests
          </Link>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {Array.from({ length: total }, (_, i) => {
            const answered = !!answers[questions[i]?.id];
            const isCurrent = i === currentIndex;
            return (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`min-w-[2rem] h-8 rounded text-xs font-medium shrink-0 ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : answered
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </aside>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="p-4 space-y-2">
          <Link
            href="/simulation"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            All Simulation Tests
          </Link>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Your Progress
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: total }, (_, i) => {
              const answered = !!answers[questions[i]?.id];
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : answered
                        ? "bg-muted text-muted-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="sticky top-16 z-40 bg-card border-b border-border">
          <div className="container py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentIndex + 1} / {total}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="container max-w-2xl py-10">
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

              <div className="mt-8">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!canSubmit}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
