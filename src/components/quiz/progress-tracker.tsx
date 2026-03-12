"use client"

import { CheckCircle, XCircle } from "lucide-react"

import { isFillAnswerCorrect, isMatchingAnswerCorrect } from "@/lib/utils"

type MatchPair = { left: string; right: string }

type QuestionShape = {
  id: string
  type: string
  correctAnswer: string | string[] | MatchPair[]
  matchPairs?: MatchPair[]
}

type ProgressTrackerProps = {
  total: number
  currentIndex: number
  answers: Record<string, string | string[] | MatchPair[]>
  questions: QuestionShape[]
  /** When false, shows answered (muted) vs unanswered only — no correct/incorrect. Default true. */
  feedbackMode?: boolean
  /** When provided, items are clickable and navigate to the question. */
  onQuestionSelect?: (index: number) => void
  /** When true, renders a compact horizontal strip for mobile. Default false. */
  compact?: boolean
}

export function ProgressTracker({
  total,
  currentIndex,
  answers,
  questions,
  feedbackMode = true,
  onQuestionSelect,
  compact = false,
}: ProgressTrackerProps) {
  const getQuestionStatus = (index: number): "correct" | "incorrect" | "answered" | "unanswered" => {
    const question = questions[index]
    if (!question) return "unanswered"

    const userAnswer = answers[question.id]
    if (!userAnswer) return "unanswered"

    if (!feedbackMode) return "answered"

    const correctPairs = (question.matchPairs ?? question.correctAnswer) as MatchPair[]
    const isCorrect =
      question.type === "matching"
        ? Array.isArray(userAnswer) && isMatchingAnswerCorrect(userAnswer as MatchPair[], correctPairs)
        : Array.isArray(question.correctAnswer) && question.type === "multiple"
          ? Array.isArray(userAnswer) &&
            question.correctAnswer.length === userAnswer.length &&
            (question.correctAnswer as string[]).every((a) => (userAnswer as string[]).includes(a))
          : question.type === "fill"
            ? typeof userAnswer === "string" && isFillAnswerCorrect(userAnswer, question.correctAnswer as string)
            : userAnswer === question.correctAnswer

    return isCorrect ? "correct" : "incorrect"
  }

  const baseClasses = compact
    ? "relative min-w-[2rem] h-8 shrink-0 rounded flex items-center justify-center text-xs font-bold transition-all"
    : "relative w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all"

  const statusClasses = (status: string, isCurrent: boolean) => {
    const ring = isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
    if (status === "correct") return `${ring} bg-success text-success-foreground`
    if (status === "incorrect") return `${ring} bg-destructive text-destructive-foreground`
    if (status === "answered") return `${ring} bg-muted text-muted-foreground`
    return `${ring} bg-muted text-muted-foreground/70`
  }

  const content = (status: string, index: number) => {
    if (status === "correct") return <CheckCircle className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
    if (status === "incorrect") return <XCircle className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
    return index + 1
  }

  const gridClasses = compact
    ? "flex gap-1.5 overflow-x-auto pb-1"
    : "grid grid-cols-5 gap-2"

  return (
    <div className={compact ? "" : "bg-card border border-border rounded-xl p-6"}>
      {!compact && (
        <h3 className="text-sm font-semibold text-foreground mb-4">Your Progress</h3>
      )}
      <div className={gridClasses}>
        {Array.from({ length: total }, (_, i) => {
          const status = getQuestionStatus(i)
          const isCurrent = i === currentIndex
          const className = `${baseClasses} ${statusClasses(status, isCurrent)}`

          if (onQuestionSelect) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => onQuestionSelect(i)}
                className={className}
              >
                {content(status, i)}
              </button>
            )
          }
          return (
            <div key={i} className={className}>
              {content(status, i)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
