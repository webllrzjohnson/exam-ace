"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, ArrowRight, ChevronRight } from "lucide-react";
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

type Quiz = {
  id: string;
  questions: Question[];
  timeLimit: number;
};

export default function QuizPlayer({ id, mode }: { id: string; mode: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [fillAnswer, setFillAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch(`/api/quizzes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setQuiz(data);
          setTimeLeft(data.timeLimit * 60);
          setStartTime(Date.now());
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const questions = quiz?.questions ?? [];
  const total = questions.length;
  const question = questions[currentIndex];

  const handleFinish = useCallback(() => {
    if (finished || !quiz || !question) return;
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
    setQuizResult({ quizId: quiz.id, answers: finalAnswers, timeTaken, mode });
    router.push(`/quiz/${quiz.id}/results`);
  }, [answers, fillAnswer, selectedOptions, question, router, quiz, startTime, mode, finished]);

  useEffect(() => {
    if (mode !== "timed" || !quiz) return;
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
  }, [mode, quiz, handleFinish]);

  if (loading || !quiz) {
    return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  }
  if (!question) {
    return <div className="container py-20 text-center text-muted-foreground">Quiz not found.</div>;
  }

  const progress = (currentIndex / total) * 100;

  const currentIsCorrect = () => {
    if (question.type === "fill") {
      return fillAnswer.trim().toLowerCase() === (question.correctAnswer as string).toLowerCase();
    }
    if (question.type === "multiple") {
      return (
        Array.isArray(question.correctAnswer) &&
        question.correctAnswer.length === selectedOptions.length &&
        question.correctAnswer.every((a) => selectedOptions.includes(a))
      );
    }
    return selectedOptions[0] === question.correctAnswer;
  };

  const handleSubmitAnswer = () => {
    if (question.type === "fill") {
      setAnswers((prev) => ({ ...prev, [question.id]: fillAnswer.trim() }));
    } else if (question.type === "multiple") {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedOptions }));
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedOptions[0] }));
    }

    if (mode === "practice") {
      setShowFeedback(true);
    } else {
      goNext();
    }
  };

  const goNext = () => {
    setShowFeedback(false);
    setSelectedOptions([]);
    setFillAnswer("");
    if (currentIndex + 1 >= total) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const toggleOption = (opt: string) => {
    if (question.type === "multiple") {
      setSelectedOptions((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
    } else {
      setSelectedOptions([opt]);
    }
  };

  const canSubmit = question.type === "fill" ? fillAnswer.trim().length > 0 : selectedOptions.length > 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="sticky top-16 z-40 bg-card border-b border-border">
        <div className="container py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1} of {total}
          </span>
          {mode === "timed" && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
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
            <span className="inline-block mb-4 px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold uppercase tracking-wide">
              {question.type === "single" && "Single Answer"}
              {question.type === "multiple" && "Multiple Answers"}
              {question.type === "boolean" && "True or False"}
              {question.type === "fill" && "Fill in the Blank"}
              {question.type === "matching" && "Matching"}
            </span>

            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-8 leading-relaxed">
              {question.question}
            </h2>

            {question.type === "fill" ? (
              <input
                type="text"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                disabled={showFeedback}
                placeholder="Type your answer..."
                className="w-full px-5 py-4 rounded-xl border-2 border-input bg-card text-foreground text-lg font-medium focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
                onKeyDown={(e) => e.key === "Enter" && canSubmit && !showFeedback && handleSubmitAnswer()}
              />
            ) : (
              <div className="space-y-3">
                {question.options?.map((opt, i) => {
                  const isSelected = selectedOptions.includes(opt);
                  const isRight =
                    showFeedback &&
                    (Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(opt) : question.correctAnswer === opt);
                  const isWrong = showFeedback && isSelected && !isRight;

                  return (
                    <button
                      key={i}
                      onClick={() => !showFeedback && toggleOption(opt)}
                      disabled={showFeedback}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all ${
                        showFeedback
                          ? isRight
                            ? "border-success bg-success/10 text-foreground"
                            : isWrong
                              ? "border-destructive bg-destructive/10 text-foreground"
                              : "border-border bg-card text-muted-foreground opacity-60"
                          : isSelected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                            showFeedback
                              ? isRight
                                ? "border-success bg-success text-success-foreground"
                                : isWrong
                                  ? "border-destructive bg-destructive text-destructive-foreground"
                                  : "border-border text-muted-foreground"
                              : isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30 text-muted-foreground"
                          }`}
                        >
                          {showFeedback && isRight ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : showFeedback && isWrong ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            String.fromCharCode(65 + i)
                          )}
                        </span>
                        {opt}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-5 rounded-xl border ${
                  currentIsCorrect() ? "bg-success/5 border-success/30" : "bg-destructive/5 border-destructive/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {currentIsCorrect() ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className={`font-bold ${currentIsCorrect() ? "text-success" : "text-destructive"}`}>
                    {currentIsCorrect() ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                {question.type === "fill" && !currentIsCorrect() && (
                  <p className="text-sm text-foreground mb-2">
                    Correct answer: <strong>{question.correctAnswer as string}</strong>
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}

            <div className="mt-8 flex justify-end">
              {showFeedback ? (
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  {currentIndex + 1 >= total ? "See Results" : "Next Question"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Answer
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
