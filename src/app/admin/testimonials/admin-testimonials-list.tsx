"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { approveReview, rejectReview } from "@/lib/actions/review";
import { Check, X } from "lucide-react";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Review = {
  id: string;
  name: string;
  province: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
  createdAt: Date;
  user: { email: string };
};

type AdminTestimonialsListProps = {
  reviews: Review[];
};

export function AdminTestimonialsList({ reviews }: AdminTestimonialsListProps): React.ReactElement {
  const router = useRouter();

  async function handleApprove(id: string) {
    const result = await approveReview(id);
    if (result.success) router.refresh();
    else alert(result.error);
  }

  async function handleReject(id: string) {
    const result = await rejectReview(id);
    if (result.success) router.refresh();
    else alert(result.error);
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <Avatar className="h-12 w-12">
                {review.avatarUrl ? (
                  <AvatarImage src={review.avatarUrl} alt={review.name} />
                ) : null}
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {getInitials(review.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.province}</p>
                <p className="text-xs text-muted-foreground">{review.user.email}</p>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <StarRating rating={review.rating} size="sm" className="mb-2" />
              <p className="text-sm text-foreground">{review.text}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="default"
                className="gap-1"
                onClick={() => handleApprove(review.id)}
              >
                <Check className="w-4 h-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={() => handleReject(review.id)}
              >
                <X className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
