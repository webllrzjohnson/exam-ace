"use server";

import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import type { ActionResult } from "@/types";
import { RegisterSchema, type RegisterInput } from "./schema";

const TOKEN_EXPIRY_HOURS = 24;

export async function register(
  input: RegisterInput
): Promise<ActionResult<void>> {
  const parsed = RegisterSchema.safeParse(input);
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

  const { email, password, name } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const passwordHash = await hash(password, 12);
  const user = await db.user.create({
    data: { email, passwordHash, name: name || null },
  });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  await db.emailVerificationToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const result = await sendVerificationEmail(email, token);
  if (!result.success) {
    await db.user.delete({ where: { id: user.id } });
    await db.emailVerificationToken.deleteMany({ where: { userId: user.id } });
    return { success: false, error: result.error ?? "Failed to send verification email" };
  }

  return { success: true, data: undefined };
}
