import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function downgradeUser(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: "free",
      subscriptionStatus: null,
      subscriptionId: null,
      subscriptionEndsAt: null,
    },
  });

  console.log(`✅ Downgraded ${email} to free tier`);
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: tsx scripts/downgrade-user.ts <email>");
  process.exit(1);
}

downgradeUser(email)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
