import { Trophy } from "lucide-react";

import type { LeaderboardEntry } from "@/lib/queries/quiz-attempt";

const medals = ["🥇", "🥈", "🥉"];

type Props = { data: LeaderboardEntry[] };

export default function LeaderboardPage({ data }: Props) {
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
        {data.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted-foreground">
            No leaderboard data yet. Complete quizzes while logged in to appear here.
          </div>
        ) : (
          data.map((entry, i) => (
            <div
              key={entry.userId}
              className={`grid grid-cols-[3rem_1fr_4rem_4rem_4rem] gap-2 px-5 py-4 items-center border-b border-border last:border-0 ${
                i < 3 ? "bg-warning/5" : ""
              }`}
            >
              <span className="text-lg">
                {i < 3 ? medals[i] : <span className="text-sm text-muted-foreground">{entry.rank}</span>}
              </span>
              <span className="font-semibold text-foreground">{entry.name}</span>
              <span className="text-center font-bold text-primary">{entry.avgScore}%</span>
              <span className="text-center text-sm text-muted-foreground">{entry.quizCount}</span>
              <span className="text-center text-sm text-muted-foreground">🔥{entry.streak}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
