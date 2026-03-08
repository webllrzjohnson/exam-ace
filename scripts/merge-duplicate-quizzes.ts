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
  const economyCat = await db.category.findUnique({ where: { slug: "economy" } });
  const cultureCat = await db.category.findFirst({ where: { slug: "culture" } });

  if (!economyCat) {
    console.error("❌ Economy category not found");
    process.exit(1);
  }

  let cultureCategory = cultureCat;
  if (!cultureCategory) {
    cultureCategory = await db.category.create({
      data: {
        slug: "culture",
        name: "Canadian Culture & Society",
        icon: "🎭",
        description: "Explore Canadian culture, languages, multiculturalism, and society.",
        color: "bg-primary/10 text-primary",
      },
    });
    console.log("✅ Created culture category");
  } else {
    await db.category.update({
      where: { slug: "culture" },
      data: { name: "Canadian Culture & Society" },
    });
  }

  await db.category.update({
    where: { slug: "economy" },
    data: { name: "Canadian Economy & Industry" },
  });

  const cultureAndSociety = await db.quiz.findUnique({
    where: { slug: "culture-and-society" },
    include: { questions: true },
  });
  const canadianCultureSociety = await db.quiz.findUnique({
    where: { slug: "canadian-culture-society" },
    include: { questions: true },
  });

  if (cultureAndSociety && cultureAndSociety.questions.length > 0) {
    const targetQuiz = canadianCultureSociety ?? (await db.quiz.create({
      data: {
        slug: "canadian-culture-society",
        title: "Canadian Culture & Society",
        description: "Discover Canadian culture and multiculturalism.",
        categoryId: cultureCategory.id,
        categoryIcon: "🎭",
        difficulty: "Easy",
        timeLimit: 10,
        passRate: 85,
        avgScore: 80,
        featured: false,
        topics: ["Languages", "Multiculturalism", "Society"],
      },
    }));

    for (const q of cultureAndSociety.questions) {
      await db.question.update({
        where: { id: q.id },
        data: { quizId: targetQuiz.id },
      });
    }
    await db.quiz.delete({ where: { slug: "culture-and-society" } });
    console.log(`✅ Merged ${cultureAndSociety.questions.length} questions from "Culture & Society" into "Canadian Culture & Society"`);
  } else if (cultureAndSociety) {
    await db.quiz.delete({ where: { slug: "culture-and-society" } });
    console.log("✅ Removed empty Culture & Society quiz");
  }

  const economyAndIndustry = await db.quiz.findUnique({
    where: { slug: "economy-and-industry" },
    include: { questions: true },
  });
  const canadianEconomyIndustry = await db.quiz.findUnique({
    where: { slug: "canadian-economy-industry" },
    include: { questions: true },
  });

  if (economyAndIndustry && economyAndIndustry.questions.length > 0) {
    const targetQuiz = canadianEconomyIndustry ?? (await db.quiz.create({
      data: {
        slug: "canadian-economy-industry",
        title: "Canadian Economy & Industry",
        description: "Learn about Canada's economy and trade.",
        categoryId: economyCat.id,
        categoryIcon: "💼",
        difficulty: "Medium",
        timeLimit: 10,
        passRate: 70,
        avgScore: 65,
        featured: false,
        topics: ["Trade", "Economy"],
      },
    }));

    for (const q of economyAndIndustry.questions) {
      await db.question.update({
        where: { id: q.id },
        data: { quizId: targetQuiz.id },
      });
    }
    await db.quiz.delete({ where: { slug: "economy-and-industry" } });
    console.log(`✅ Merged ${economyAndIndustry.questions.length} questions from "Economy & Industry" into "Canadian Economy & Industry"`);
  } else if (economyAndIndustry) {
    await db.quiz.delete({ where: { slug: "economy-and-industry" } });
    console.log("✅ Removed empty Economy & Industry quiz");
  }

  if (!cultureAndSociety && !economyAndIndustry) {
    console.log("No duplicate quizzes to merge.");
  }

  console.log("\n✅ Merge complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
