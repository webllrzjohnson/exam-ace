"use server";

import { sendEmail } from "@/lib/email";

const RESET_PASSWORD_URL = process.env.RESET_PASSWORD_URL ?? "http://localhost:3000";

export async function sendResetEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${RESET_PASSWORD_URL}/reset-password/${token}`;

  if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
    console.log("[Password Reset] Reset link for", email, ":", resetUrl);
    return { success: true };
  }

  if (process.env.RESEND_API_KEY) {
    return sendEmail(
      email,
      "Reset your password - Canadian Citizenship Test Prep",
      `<p>Click the link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p>`,
      `Click the link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`
    );
  }

  if (process.env.SMTP_HOST) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@example.com",
        to: email,
        subject: "Reset your password - Canadian Citizenship Test Prep",
        text: `Click the link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
        html: `<p>Click the link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p>`,
      });
      return { success: true };
    } catch (err) {
      console.error("[sendResetEmail]", err);
      return { success: false, error: "Failed to send email" };
    }
  }

  console.log("[Password Reset] No SMTP configured. Reset link:", resetUrl);
  return { success: true };
}
