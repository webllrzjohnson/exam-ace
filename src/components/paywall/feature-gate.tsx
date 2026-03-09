"use client";

import { useSession } from "next-auth/react";
import { getUserTier, type UserTier } from "@/lib/access-control";
import { UpgradePrompt } from "./upgrade-prompt";

type FeatureGateProps = {
  requiredTier: UserTier;
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showPrompt?: boolean;
};

export function FeatureGate({ requiredTier, feature, children, fallback, showPrompt = true }: FeatureGateProps) {
  const { data: session } = useSession();
  const userTier = getUserTier(session);

  const tierRank = { guest: 0, free: 1, premium: 2 };
  const hasAccess = tierRank[userTier] >= tierRank[requiredTier];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showPrompt) {
    return <UpgradePrompt feature={feature} reason={userTier === "guest" ? "guest" : "premium_feature"} />;
  }

  return <>{fallback}</>;
}
