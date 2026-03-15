"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { submitTestimonial } from "@/lib/actions/review";
import { z } from "zod";

const SubmitTestimonialSchema = z.object({
  rating: z.number().min(1, "Select a rating").max(5),
  text: z.string().min(10, "At least 10 characters").max(1000, "Max 1000 characters"),
});

type SubmitTestimonialInput = z.infer<typeof SubmitTestimonialSchema>;

type TestimonialFormProps = {
  existingReview: {
    id: string;
    rating: number;
    text: string;
    status: string;
  } | null;
};

export default function TestimonialForm({ existingReview }: TestimonialFormProps): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SubmitTestimonialInput>({
    resolver: zodResolver(SubmitTestimonialSchema),
    defaultValues: {
      rating: existingReview?.rating ?? 5,
      text: existingReview?.text ?? "",
    },
  });

  const rating = form.watch("rating");
  const isPending = existingReview?.status === "pending";
  const isApproved = existingReview?.status === "approved";

  async function onSubmit(values: SubmitTestimonialInput) {
    setError(null);
    const result = await submitTestimonial(values);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error ?? "Failed to submit");
    }
  }

  if (isApproved) {
    return (
      <div className="max-w-xl rounded-xl border border-border bg-card p-6 shadow-card">
        <p className="text-foreground font-medium mb-2">Your testimonial has been approved and is live on the homepage.</p>
        <p className="text-sm text-muted-foreground mb-4">
          Thank you for sharing your experience!
        </p>
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          View on homepage →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isPending && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
              Your testimonial is pending approval. You can edit it below.
            </div>
          )}

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            field.value >= star ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your testimonial</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your experience with the citizenship test prep..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : isPending ? "Update testimonial" : "Submit testimonial"}
            </Button>
            <Link href="/dashboard/profile">
              <Button type="button" variant="outline">
                Edit profile (name, province, avatar)
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
