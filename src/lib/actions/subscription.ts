"use server";

import { db } from "@/lib/db";

export async function setPremiumByStripeSubscriptionId(
  subscriptionId: string,
  status: string,
  endsAt: Date | null
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.user.updateMany({
      where: { subscriptionId },
      data: {
        subscriptionTier: status === "active" ? "premium" : "free",
        subscriptionStatus: status,
        subscriptionEndsAt: endsAt,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("[setPremiumByStripeSubscriptionId]", err);
    return { success: false, error: "Failed to update subscription" };
  }
}

export async function setPremiumByUserId(
  userId: string,
  subscriptionId: string,
  status: string,
  endsAt: Date | null
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: status === "active" ? "premium" : "free",
        subscriptionStatus: status,
        subscriptionId,
        subscriptionEndsAt: endsAt,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("[setPremiumByUserId]", err);
    return { success: false, error: "Failed to update subscription" };
  }
}
