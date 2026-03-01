import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { getQuizById, type Question } from '@/data/quizData';

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const quiz = getQuizById(id || '');
  const { answers, wrongQuestions } = (location.state || {}) as {
    answers: Record<string, string | string[]>;
    wrongQuestions: Question[];
  };

  if (!quiz || !wrongQuestions) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">No review data available.</p>
        <Link to="/quizzes" className="text-primary font-medium hover:underline">Back to quizzes</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <Link to={`/quiz/${quiz.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to quiz
      </Link>

      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Review Wrong Answers</h1>
      <p className="text-muted-foreground mb-8">You got {wrongQuestions.length} question{wrongQuestions.length > 1 ? 's' : ''} wrong. Study the explanations below.</p>

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

              {q.options ? (
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, j) => {
                    const isCorrectOpt = Array.isArray(q.correctAnswer)
                      ? q.correctAnswer.includes(opt)
                      : q.correctAnswer === opt;
                    const isUserAnswer = Array.isArray(userAnswer)
                      ? userAnswer.includes(opt)
                      : userAnswer === opt;

                    return (
                      <div
                        key={j}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium ${
                          isCorrectOpt
                            ? 'border-success bg-success/10 text-foreground'
                            : isUserAnswer
                              ? 'border-destructive bg-destructive/10 text-foreground'
                              : 'border-border text-muted-foreground'
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
                        {isUserAnswer && !isCorrectOpt && <span className="ml-auto text-xs text-destructive font-semibold">Your answer</span>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mb-4 space-y-1">
                  <p className="text-sm"><span className="text-destructive font-medium">Your answer:</span> {userAnswer || '(no answer)'}</p>
                  <p className="text-sm"><span className="text-success font-medium">Correct answer:</span> {q.correctAnswer as string}</p>
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
        <Link
          to={`/quiz/${quiz.id}`}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Retry This Quiz
        </Link>
      </div>
    </div>
  );
}
