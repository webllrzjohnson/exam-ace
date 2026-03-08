"use server";

import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { sendResetEmail } from "@/lib/actions/send-reset-email";
import type { ActionResult } from "@/types";
import { z } from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

const TOKEN_EXPIRY_HOURS = 1;

export async function requestPasswordReset(
  input: ForgotPasswordInput
): Promise<ActionResult<void>> {
  const parsed = ForgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid email",
      fieldErrors: { email: "Invalid email" },
    };
  }

  const { email } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { success: true, data: undefined };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  await db.passwordResetToken.create({
    data: { email, token, expiresAt },
  });

  const result = await sendResetEmail(email, token);
  if (!result.success) {
    return { success: false, error: result.error ?? "Failed to send email" };
  }

  return { success: true, data: undefined };
}
