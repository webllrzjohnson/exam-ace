import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPendingReviews } from "@/lib/queries/review";
import { AdminTestimonialsList } from "./admin-testimonials-list";
import { MessageSquare, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Manage Testimonials | Admin",
  description: "Approve or reject pending testimonials",
};

export default async function AdminTestimonialsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin/testimonials");
  }

  const pendingReviews = await getPendingReviews();

  return (
    <div className="container py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manage Testimonials</h1>
      <p className="text-muted-foreground mb-8">
        Approve or reject pending testimonials. Approved testimonials appear on the homepage.
      </p>

      {pendingReviews.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-foreground font-medium">No pending testimonials</p>
          <p className="text-sm text-muted-foreground mt-1">
            New testimonials from premium users will appear here for approval.
          </p>
        </div>
      ) : (
        <AdminTestimonialsList reviews={pendingReviews} />
      )}
    </div>
  );
}
