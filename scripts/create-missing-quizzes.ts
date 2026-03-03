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
  const economyCategory = await db.category.findUnique({
    where: { slug: "economy" },
  });
  
  if (!economyCategory) {
    console.error("❌ Economy category not found!");
    process.exit(1);
  }
  
  const existingEconomyQuiz = await db.quiz.findFirst({
    where: { categoryId: economyCategory.id },
  });
  
  if (existingEconomyQuiz) {
    console.log(`✅ Economy quiz already exists: ${existingEconomyQuiz.title}`);
  } else {
    const economyQuiz = await db.quiz.create({
      data: {
        slug: "canadian-economy-industry",
        title: "Canadian Economy & Industry",
        description: "Test your knowledge of Canada's economy, industries, trade, natural resources, and economic development.",
        categoryId: economyCategory.id,
        categoryIcon: economyCategory.icon,
        difficulty: "Medium",
        timeLimit: 30,
        passRate: 70,
        avgScore: 75,
        featured: false,
        topics: [
          "Economy",
          "Industry",
          "Trade",
          "Agriculture",
          "Natural Resources",
          "Energy",
          "Manufacturing",
        ],
      },
    });
    console.log(`✅ Created Economy quiz: ${economyQuiz.title} (${economyQuiz.id})`);
  }
  
  const cultureCategory = await db.category.findFirst({
    where: { slug: "culture" },
  });
  
  if (!cultureCategory) {
    console.log("⚠️  Culture category doesn't exist - creating it...");
    
    const newCultureCategory = await db.category.create({
      data: {
        slug: "culture",
        name: "Culture & Society",
        icon: "🎭",
        description: "Explore Canadian culture, languages, multiculturalism, sports, and arts.",
        color: "purple",
      },
    });
    
    const cultureQuiz = await db.quiz.create({
      data: {
        slug: "canadian-culture-society",
        title: "Canadian Culture & Society",
        description: "Discover Canada's multicultural heritage, official languages, sports, arts, and national identity.",
        categoryId: newCultureCategory.id,
        categoryIcon: newCultureCategory.icon,
        difficulty: "Medium",
        timeLimit: 30,
        passRate: 70,
        avgScore: 75,
        featured: false,
        topics: [
          "Culture",
          "Multiculturalism",
          "Languages",
          "Sports",
          "Arts",
          "National Identity",
        ],
      },
    });
    console.log(`✅ Created Culture category and quiz: ${cultureQuiz.title} (${cultureQuiz.id})`);
  } else {
    const existingCultureQuiz = await db.quiz.findFirst({
      where: { categoryId: cultureCategory.id },
    });
    
    if (existingCultureQuiz) {
      console.log(`✅ Culture quiz already exists: ${existingCultureQuiz.title}`);
    } else {
      const cultureQuiz = await db.quiz.create({
        data: {
          slug: "canadian-culture-society",
          title: "Canadian Culture & Society",
          description: "Discover Canada's multicultural heritage, official languages, sports, arts, and national identity.",
          categoryId: cultureCategory.id,
          categoryIcon: cultureCategory.icon,
          difficulty: "Medium",
          timeLimit: 30,
          passRate: 70,
          avgScore: 75,
          featured: false,
          topics: [
            "Culture",
            "Multiculturalism",
            "Languages",
            "Sports",
            "Arts",
            "National Identity",
          ],
        },
      });
      console.log(`✅ Created Culture quiz: ${cultureQuiz.title} (${cultureQuiz.id})`);
    }
  }
  
  console.log("\n✅ All required quizzes are now in place!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
