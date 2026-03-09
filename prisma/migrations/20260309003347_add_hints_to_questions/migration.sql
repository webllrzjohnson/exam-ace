-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "hints" TEXT[] DEFAULT ARRAY[]::TEXT[];
