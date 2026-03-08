"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { requestPasswordReset } from "./actions";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(values: ForgotPasswordInput) {
    const result = await requestPasswordReset(values);
    if (result.success === false) {
      form.setError("root", { message: result.error });
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          Check your email for a reset link. If you don&apos;t see it, check your spam folder.
        </div>
        <Link
          href="/login"
          className="block text-center text-sm font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </Form>
  );
}
