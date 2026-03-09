import { Crown, User } from "lucide-react";
import type { UserTier } from "@/lib/access-control";

type TierBadgeProps = {
  tier: UserTier;
  size?: "sm" | "md" | "lg";
};

export function TierBadge({ tier, size = "md" }: TierBadgeProps) {
  if (tier === "guest") return null;

  const isPremium = tier === "premium";

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses[size]} ${
        isPremium
          ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 border border-amber-500/20"
          : "bg-muted text-muted-foreground border border-border"
      }`}
    >
      {isPremium ? <Crown className={iconSizes[size]} /> : <User className={iconSizes[size]} />}
      {isPremium ? "Premium" : "Free"}
    </span>
  );
}
