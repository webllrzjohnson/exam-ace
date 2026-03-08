"use server";

import { hash } from "bcryptjs";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types";
import { RegisterSchema, type RegisterInput } from "./schema";

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
  await db.user.create({
    data: { email, passwordHash, name: name || null },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });

  return { success: true, data: undefined };
}
