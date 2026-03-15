"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PROVINCES } from "@/lib/provinces";
import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().max(100).optional(),
  province: z.enum(PROVINCES).optional().nullable(),
  avatarUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export async function updateProfile(
  input: UpdateProfileInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name || null }),
        ...(parsed.data.province !== undefined && { province: parsed.data.province }),
        ...(parsed.data.avatarUrl !== undefined && {
          avatarUrl: parsed.data.avatarUrl && parsed.data.avatarUrl !== "" ? parsed.data.avatarUrl : null,
        }),
      },
    });
    return { success: true };
  } catch (err) {
    console.error("[updateProfile]", err);
    return { success: false, error: "Failed to update profile" };
  }
}
