import { readFileSync, existsSync } from "fs";
import { join } from "path";

if (existsSync(join(process.cwd(), ".env"))) {
  const env = readFileSync(join(process.cwd(), ".env"), "utf-8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const categories = await db.category.findMany({
    include: {
      quizzes: {
        include: {
          _count: { select: { questions: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });
  
  console.log("Categories and their quizzes:\n");
  for (const cat of categories) {
    console.log(`${cat.name} (${cat.slug}):`);
    if (cat.quizzes.length === 0) {
      console.log("  ⚠️  NO QUIZZES IN THIS CATEGORY");
    } else {
      for (const quiz of cat.quizzes) {
        console.log(`  - ${quiz.title} (${quiz._count.questions} questions)`);
      }
    }
    console.log();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
