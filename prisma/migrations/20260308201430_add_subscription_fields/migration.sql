-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT,
ADD COLUMN     "subscriptionTier" TEXT NOT NULL DEFAULT 'free';

-- CreateTable
CREATE TABLE "DailyQuizLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyQuizLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyQuizLimit_userId_idx" ON "DailyQuizLimit"("userId");

-- CreateIndex
CREATE INDEX "DailyQuizLimit_date_idx" ON "DailyQuizLimit"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuizLimit_userId_date_key" ON "DailyQuizLimit"("userId", "date");
