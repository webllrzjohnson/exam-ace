"use server";

import { db } from "@/lib/db";

export async function verifyEmail(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const record = await db.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return { success: false, error: "Invalid or expired verification link." };
  }

  if (new Date() > record.expiresAt) {
    await db.emailVerificationToken.delete({ where: { id: record.id } });
    return { success: false, error: "This verification link has expired." };
  }

  const user = await db.user.findUnique({ where: { id: record.userId } });
  if (!user) {
    await db.emailVerificationToken.delete({ where: { id: record.id } });
    return { success: false, error: "User not found." };
  }

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    }),
    db.emailVerificationToken.delete({ where: { id: record.id } }),
  ]);

  return { success: true };
}
