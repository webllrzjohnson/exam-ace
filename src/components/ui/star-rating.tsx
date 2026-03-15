import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps): React.ReactElement {
  const clamped = Math.min(Math.max(0, Math.round(rating)), max);
  const iconClass = sizeClasses[size];

  return (
    <div className={cn("flex gap-0.5", className)} role="img" aria-label={`${clamped} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            iconClass,
            i < clamped ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}
