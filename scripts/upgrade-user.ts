import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function upgradeUser(email: string) {
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
      subscriptionTier: "premium",
      subscriptionStatus: "active",
    },
  });

  console.log(`✅ Upgraded ${email} to premium tier`);
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: tsx scripts/upgrade-user.ts <email>");
  process.exit(1);
}

upgradeUser(email)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
