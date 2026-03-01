import { useParams, useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, TrendingUp, Target, BookOpen } from 'lucide-react';
import { getQuizById } from '@/data/quizData';
import DifficultyBadge from '@/components/DifficultyBadge';
import { useState } from 'react';

export default function QuizDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = getQuizById(id || '');
  const [mode, setMode] = useState<'practice' | 'timed'>('practice');

  if (!quiz) {
    return <div className="container py-20 text-center text-muted-foreground">Quiz not found.</div>;
  }

  const handleStart = () => {
    navigate(`/quiz/${quiz.id}/play`, { state: { mode } });
  };

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{quiz.categoryIcon}</span>
          <DifficultyBadge difficulty={quiz.difficulty} />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">{quiz.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{quiz.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: HelpCircle, label: 'Questions', value: quiz.questionCount },
          { icon: Clock, label: 'Time Limit', value: `${quiz.timeLimit} min` },
          { icon: TrendingUp, label: 'Pass Rate', value: `${quiz.passRate}%` },
          { icon: Target, label: 'Avg Score', value: `${quiz.avgScore}%` },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center shadow-card">
            <s.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Topics Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {quiz.topics.map(topic => (
            <span key={topic} className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm font-medium">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Mode selector */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-foreground mb-3">Select Mode</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('practice')}
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              mode === 'practice'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <div className="text-lg font-bold text-foreground mb-1">📝 Practice Mode</div>
            <p className="text-sm text-muted-foreground">No time pressure. Get instant feedback after each question.</p>
          </button>
          <button
            onClick={() => setMode('timed')}
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              mode === 'timed'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <div className="text-lg font-bold text-foreground mb-1">⏱️ Timed Exam</div>
            <p className="text-sm text-muted-foreground">Simulate the real test with a countdown timer.</p>
          </button>
        </div>
      </div>

      {/* Start */}
      <button
        onClick={handleStart}
        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
      >
        Start Quiz →
      </button>
    </div>
  );
}
