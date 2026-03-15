import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTier } from "@/lib/access-control";
import { getUserReview } from "@/lib/queries/review";
import TestimonialForm from "@/components/pages/TestimonialForm";
import { Crown } from "lucide-react";

export const metadata = {
  title: "Leave a Testimonial | Canadian Citizenship",
  description: "Share your experience with other students",
};

export default async function TestimonialsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/testimonials");
  }

  const tier = getUserTier(session);
  const canSubmit = tier === "premium";

  if (!canSubmit) {
    return (
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Leave a Testimonial</h1>
        <p className="text-muted-foreground mb-8">
          Premium subscribers can share their experience. Upgrade to submit a testimonial.
        </p>
        <div className="max-w-lg rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start gap-3">
            <Crown className="w-10 h-10 text-amber-500 shrink-0" />
            <div>
              <h2 className="font-semibold text-foreground mb-2">Upgrade to Premium</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Premium members can leave a testimonial that appears on the homepage after approval.
              </p>
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90"
              >
                <Crown className="w-4 h-4" />
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const existingReview = await getUserReview(session.user.id);

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Leave a Testimonial</h1>
      <p className="text-muted-foreground mb-8">
        Share your experience with other students. Your name, province, and avatar from your profile will be used.
      </p>
      <TestimonialForm existingReview={existingReview} />
    </div>
  );
}
