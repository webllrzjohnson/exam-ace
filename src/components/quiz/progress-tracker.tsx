"use client"

import { CheckCircle, XCircle } from "lucide-react"

import { isFillAnswerCorrect } from "@/lib/utils"

type ProgressTrackerProps = {
  total: number
  currentIndex: number
  answers: Record<string, string | string[]>
  questions: Array<{
    id: string
    type: string
    correctAnswer: string | string[]
  }>
}

export function ProgressTracker({
  total,
  currentIndex,
  answers,
  questions,
}: ProgressTrackerProps) {
  const getQuestionStatus = (index: number) => {
    const question = questions[index]
    if (!question) return "unanswered"

    const userAnswer = answers[question.id]
    if (!userAnswer) return "unanswered"

    const isCorrect = Array.isArray(question.correctAnswer)
      ? Array.isArray(userAnswer) &&
        question.correctAnswer.length === userAnswer.length &&
        question.correctAnswer.every((a) => userAnswer.includes(a))
      : question.type === "fill"
        ? typeof userAnswer === "string" && isFillAnswerCorrect(userAnswer, question.correctAnswer as string)
        : userAnswer === question.correctAnswer

    return isCorrect ? "correct" : "incorrect"
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Your Progress</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }, (_, i) => {
          const status = getQuestionStatus(i)
          const isCurrent = i === currentIndex

          return (
            <div
              key={i}
              className={`
                relative w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all
                ${
                  isCurrent
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : ""
                }
                ${
                  status === "correct"
                    ? "bg-success text-success-foreground"
                    : status === "incorrect"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground"
                }
              `}
            >
              {status === "correct" ? (
                <CheckCircle className="w-4 h-4" />
              ) : status === "incorrect" ? (
                <XCircle className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
