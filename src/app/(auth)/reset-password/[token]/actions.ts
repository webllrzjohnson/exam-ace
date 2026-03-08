"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types";
import { ResetPasswordSchema, type ResetPasswordInput } from "./schema";

export async function resetPassword(
  token: string,
  input: ResetPasswordInput
): Promise<ActionResult<void>> {
  const parsed = ResetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const [k, v] of Object.entries(flattened.fieldErrors)) {
      fieldErrors[k] = Array.isArray(v) ? v[0] : String(v ?? "");
    }
    return {
      success: false,
      error: "Invalid input",
      fieldErrors,
    };
  }

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return {
      success: false,
      error: "Invalid or expired reset link. Please request a new one.",
    };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  await db.$transaction([
    db.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    }),
    db.passwordResetToken.delete({ where: { id: resetToken.id } }),
  ]);

  redirect("/login");
}
