import { db } from "@/lib/db";

export type ReviewForDisplay = {
  id: string;
  name: string;
  province: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
  createdAt: Date;
};

export async function getApprovedReviews(limit = 20): Promise<ReviewForDisplay[]> {
  const rows = await db.review.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      province: true,
      rating: true,
      text: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  return rows;
}

export async function getUserReview(userId: string) {
  return db.review.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingReviews() {
  return db.review.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { email: true },
      },
    },
  });
}
