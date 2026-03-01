import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  className?: string;
}

export default function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const styles = {
    Easy: 'bg-success/10 text-success border-success/20',
    Medium: 'bg-warning/10 text-warning border-warning/20',
    Hard: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', styles[difficulty], className)}>
      {difficulty}
    </span>
  );
}
