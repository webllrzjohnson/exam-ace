-- Backfill emailVerified for existing users (grandfather them in)
UPDATE "User" SET "emailVerified" = "createdAt" WHERE "emailVerified" IS NULL;