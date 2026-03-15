"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessFeature, getUserTier } from "@/lib/access-control";
import { z } from "zod";

const SubmitTestimonialSchema = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().min(10).max(1000),
});

export type SubmitTestimonialInput = z.infer<typeof SubmitTestimonialSchema>;

export async function submitTestimonial(
  input: SubmitTestimonialInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to submit a testimonial" };
  }

  const tier = getUserTier(session);
  if (!canAccessFeature(tier, "canSubmitTestimonial")) {
    return { success: false, error: "Premium subscription required to submit a testimonial" };
  }

  const parsed = SubmitTestimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input. Rating 1-5, text 10-1000 characters." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, province: true, avatarUrl: true },
  });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const displayName = user.name?.trim() || "Anonymous";
  const province = user.province?.trim() || "Canada";

  try {
    const existing = await db.review.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (existing && existing.status === "approved") {
      return { success: false, error: "You already have an approved testimonial" };
    }

    if (existing && existing.status === "pending") {
      await db.review.update({
        where: { id: existing.id },
        data: {
          rating: parsed.data.rating,
          text: parsed.data.text,
          name: displayName,
          province,
          avatarUrl: user.avatarUrl,
          status: "pending",
        },
      });
    } else {
      await db.review.create({
        data: {
          userId: session.user.id,
          rating: parsed.data.rating,
          text: parsed.data.text,
          name: displayName,
          province,
          avatarUrl: user.avatarUrl,
          status: "pending",
        },
      });
    }
    return { success: true };
  } catch (err) {
    console.error("[submitTestimonial]", err);
    return { success: false, error: "Failed to submit testimonial" };
  }
}

export async function approveReview(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.review.update({
      where: { id: reviewId },
      data: { status: "approved" },
    });
    return { success: true };
  } catch (err) {
    console.error("[approveReview]", err);
    return { success: false, error: "Failed to approve review" };
  }
}

export async function rejectReview(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.review.update({
      where: { id: reviewId },
      data: { status: "rejected" },
    });
    return { success: true };
  } catch (err) {
    console.error("[rejectReview]", err);
    return { success: false, error: "Failed to reject review" };
  }
}
