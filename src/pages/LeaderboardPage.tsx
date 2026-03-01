import { Trophy } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Sarah M.', score: 98, quizzes: 24, streak: 15 },
  { rank: 2, name: 'Ahmed K.', score: 96, quizzes: 22, streak: 12 },
  { rank: 3, name: 'Lin W.', score: 95, quizzes: 20, streak: 10 },
  { rank: 4, name: 'Priya S.', score: 93, quizzes: 18, streak: 8 },
  { rank: 5, name: 'Carlos R.', score: 92, quizzes: 17, streak: 7 },
  { rank: 6, name: 'Emma T.', score: 90, quizzes: 15, streak: 6 },
  { rank: 7, name: 'David L.', score: 89, quizzes: 14, streak: 5 },
  { rank: 8, name: 'Fatima A.', score: 88, quizzes: 13, streak: 4 },
  { rank: 9, name: 'James P.', score: 87, quizzes: 12, streak: 3 },
  { rank: 10, name: 'Yuki N.', score: 85, quizzes: 11, streak: 2 },
];

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  return (
    <div className="container max-w-2xl py-10">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-7 h-7 text-warning" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers this month</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_4rem_4rem_4rem] gap-2 px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>#</span>
          <span>Name</span>
          <span className="text-center">Score</span>
          <span className="text-center">Quizzes</span>
          <span className="text-center">Streak</span>
        </div>
        {leaderboardData.map((entry, i) => (
          <div
            key={entry.rank}
            className={`grid grid-cols-[3rem_1fr_4rem_4rem_4rem] gap-2 px-5 py-4 items-center border-b border-border last:border-0 ${
              i < 3 ? 'bg-warning/5' : ''
            }`}
          >
            <span className="text-lg">{i < 3 ? medals[i] : <span className="text-sm text-muted-foreground">{entry.rank}</span>}</span>
            <span className="font-semibold text-foreground">{entry.name}</span>
            <span className="text-center font-bold text-primary">{entry.score}%</span>
            <span className="text-center text-sm text-muted-foreground">{entry.quizzes}</span>
            <span className="text-center text-sm text-muted-foreground">🔥{entry.streak}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
