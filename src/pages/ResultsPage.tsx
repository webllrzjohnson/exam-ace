import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, RotateCcw, Home, Eye } from 'lucide-react';
import { getQuizById, type Question } from '@/data/quizData';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = getQuizById(id || '');
  const { answers, timeTaken, mode } = (location.state || {}) as {
    answers: Record<string, string | string[]>;
    timeTaken: number;
    mode: string;
  };

  if (!quiz || !answers) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">No results available.</p>
        <Link to="/quizzes" className="text-primary font-medium hover:underline">Back to quizzes</Link>
      </div>
    );
  }

  const questions = quiz.questions;
  const correctCount = questions.filter(q => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (Array.isArray(q.correctAnswer)) {
      return Array.isArray(ans) && q.correctAnswer.length === ans.length && q.correctAnswer.every(a => ans.includes(a));
    }
    if (q.type === 'fill') {
      return typeof ans === 'string' && ans.toLowerCase() === (q.correctAnswer as string).toLowerCase();
    }
    return ans === q.correctAnswer;
  }).length;

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 75;
  const incorrectCount = questions.length - correctCount;
  const wrongQuestions = questions.filter(q => {
    const ans = answers[q.id];
    if (!ans) return true;
    if (Array.isArray(q.correctAnswer)) {
      return !(Array.isArray(ans) && q.correctAnswer.length === ans.length && q.correctAnswer.every(a => ans.includes(a)));
    }
    if (q.type === 'fill') {
      return typeof ans !== 'string' || ans.toLowerCase() !== (q.correctAnswer as string).toLowerCase();
    }
    return ans !== q.correctAnswer;
  });

  // Topic breakdown
  const topicMap = new Map<string, { correct: number; total: number }>();
  questions.forEach(q => {
    const entry = topicMap.get(q.topic) || { correct: 0, total: 0 };
    entry.total++;
    const ans = answers[q.id];
    if (ans) {
      const isCorrect = Array.isArray(q.correctAnswer)
        ? Array.isArray(ans) && q.correctAnswer.length === ans.length && q.correctAnswer.every(a => ans.includes(a))
        : q.type === 'fill'
          ? typeof ans === 'string' && ans.toLowerCase() === (q.correctAnswer as string).toLowerCase()
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

  return (
    <div className="container max-w-2xl py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Score circle */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4 ${
            passed ? 'border-success' : 'border-destructive'
          }`}>
            <div>
              <div className={`text-4xl font-display font-extrabold ${passed ? 'text-success' : 'text-destructive'}`}>{score}%</div>
              <div className={`text-sm font-semibold ${passed ? 'text-success' : 'text-destructive'}`}>{passed ? 'PASSED' : 'FAILED'}</div>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {passed ? '🎉 Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-muted-foreground">
            {passed
              ? 'You passed the quiz! Great job on your preparation.'
              : 'You need 75% to pass. Review the topics below and try again.'}
          </p>
        </div>

        {/* Stats grid */}
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

        {/* Topic breakdown */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
          <h2 className="font-display font-bold text-foreground mb-4">Topic Breakdown</h2>
          <div className="space-y-3">
            {Array.from(topicMap.entries()).map(([topic, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{topic}</span>
                    <span className="text-muted-foreground">{data.correct}/{data.total} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 75 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-destructive'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {wrongQuestions.length > 0 && (
            <button
              onClick={() => navigate(`/quiz/${quiz.id}/review`, {
                state: { answers, wrongQuestions },
              })}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <Eye className="w-4 h-4" />
              Review Wrong Answers
            </button>
          )}
          <button
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </button>
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
