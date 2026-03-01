import { BarChart3, BookOpen, Target, Flame, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Your Dashboard</h1>
      <p className="text-muted-foreground mb-8">Track your progress and keep practicing</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: 'Quizzes Taken', value: '0', color: 'text-primary' },
          { icon: Target, label: 'Avg Score', value: '—', color: 'text-success' },
          { icon: Flame, label: 'Day Streak', value: '0', color: 'text-warning' },
          { icon: TrendingUp, label: 'Improvement', value: '—', color: 'text-primary' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5 shadow-card">
            <stat.icon className={`w-5 h-5 mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-card border border-border rounded-xl p-12 text-center shadow-card">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
        <h2 className="font-display text-xl font-bold text-foreground mb-2">No quiz history yet</h2>
        <p className="text-muted-foreground mb-6">Take your first quiz to start tracking your progress.</p>
        <a
          href="/quizzes"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Browse Quizzes
        </a>
      </div>
    </div>
  );
}
