"use client";

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { StarRating } from "@/components/ui/star-rating";

type ReviewForDisplay = {
  id: string;
  name: string;
  province: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type TestimonialsSectionProps = {
  reviews: ReviewForDisplay[];
};

export function TestimonialsSection({ reviews }: TestimonialsSectionProps): React.ReactElement {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [api]);

  if (reviews.length === 0) {
    return (
      <section className="container py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">Thank you for the kind words</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join hundreds who passed the Canadian citizenship test. Be the first to share your experience!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">Thank you for the kind words</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Join hundreds who passed the Canadian citizenship test. Here&apos;s what our community has to say.
        </p>
      </div>

      <Carousel
        opts={{ align: "start", loop: true }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {reviews.map((review) => (
            <CarouselItem
              key={review.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="rounded-xl border border-border bg-card shadow-card p-6 h-full flex flex-col">
                <StarRating rating={review.rating} size="md" className="mb-4" />
                <p className="text-foreground text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {review.avatarUrl ? (
                      <AvatarImage src={review.avatarUrl} alt={review.name} />
                    ) : null}
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                      {getInitials(review.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{review.name}</p>
                    <p className="text-muted-foreground text-xs">{review.province}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 sm:-left-12" />
        <CarouselNext className="-right-4 sm:-right-12" />
      </Carousel>
    </section>
  );
}
