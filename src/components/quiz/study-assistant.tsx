"use client"

import { useState } from "react"
import { Lightbulb, BookOpen, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type StudyAssistantProps = {
  hints: string[]
  explanation: string
  showAfterAnswer?: boolean
  isAnswered?: boolean
}

export function StudyAssistant({
  hints,
  explanation,
  showAfterAnswer = false,
  isAnswered = false,
}: StudyAssistantProps) {
  const [currentHintIndex, setCurrentHintIndex] = useState(-1)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleShowHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1)
    }
  }

  const handleShowExplanation = () => {
    setShowExplanation(true)
  }

  if (showAfterAnswer && !isAnswered) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-semibold">Study Assistant</span>
      </div>

      {!isAnswered && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowHint}
            disabled={currentHintIndex >= hints.length - 1}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Give me a hint
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowExplanation}
            disabled={showExplanation}
            className="gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Help me understand
          </Button>
        </div>
      )}

      {currentHintIndex >= 0 && !isAnswered && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              {hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                <p key={index} className="text-sm text-blue-900 dark:text-blue-100">
                  {hint}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {(showExplanation || isAnswered) && (
        <Card className="p-4 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                Explanation
              </p>
              <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
