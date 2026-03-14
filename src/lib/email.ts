"use server";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const APP_URL = process.env.APP_URL ?? process.env.RESET_PASSWORD_URL ?? "http://localhost:3000";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    return { success: false, error: "Resend not configured" };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text ?? html.replace(/<[^>]*>/g, ""),
    });
    if (error) {
      console.error("[sendEmail]", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("[sendEmail]", err);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  const verifyUrl = `${APP_URL}/verify-email/${token}`;

  if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
    console.log("[Email Verification] Verify link for", email, ":", verifyUrl);
    return { success: true };
  }

  if (resend) {
    return sendEmail(
      email,
      "Verify your email - Canadian Citizenship Test Prep",
      `<p>Click the link to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
      `Click the link to verify your email: ${verifyUrl}\n\nThis link expires in 24 hours.`
    );
  }

  console.log("[Email Verification] No Resend configured. Verify link:", verifyUrl);
  return { success: true };
}
