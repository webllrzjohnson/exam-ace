/**
 * Fixes questions that were imported into the wrong quiz (category mismatch).
 * Uses question.topic to determine intended category and moves questions to the correct quiz.
 *
 * Topic → category mapping (from citizenship import):
 *   Government, History, Rights and Responsibilities, Symbols, Geography, Provinces and Territories
 *
 * Usage: npx tsx scripts/fix-question-categories.ts [--dry-run]
 */

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

const TOPIC_TO_CATEGORY_SLUG: Record<string, string> = {
  Government: "government",
  History: "history",
  "Rights and Responsibilities": "rights",
  Symbols: "symbols",
  Geography: "geography",
  "Provinces and Territories": "geography",
};

function getExpectedCategorySlug(topic: string): string | null {
  return TOPIC_TO_CATEGORY_SLUG[topic] ?? null;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("DRY RUN - no changes will be made\n");

  const questions = await db.question.findMany({
    include: {
      quiz: { include: { category: true } },
    },
  });

  const mismatches: Array<{
    questionId: string;
    questionPreview: string;
    topic: string;
    currentQuiz: string;
    currentCategory: string;
    expectedCategory: string;
  }> = [];

  for (const q of questions) {
    const expectedSlug = getExpectedCategorySlug(q.topic);
    if (!expectedSlug) continue;

    const currentSlug = q.quiz.category.slug;
    if (currentSlug === expectedSlug) continue;

    mismatches.push({
      questionId: q.id,
      questionPreview: q.question.slice(0, 60) + (q.question.length > 60 ? "..." : ""),
      topic: q.topic,
      currentQuiz: q.quiz.title,
      currentCategory: currentSlug,
      expectedCategory: expectedSlug,
    });
  }

  if (mismatches.length === 0) {
    console.log("No mismatched questions found. All questions are in the correct category.");
    return;
  }

  console.log(`Found ${mismatches.length} question(s) in wrong category:\n`);
  mismatches.forEach((m, i) => {
    console.log(`${i + 1}. "${m.questionPreview}"`);
    console.log(`   Topic: ${m.topic} → should be in ${m.expectedCategory}, but is in ${m.currentCategory} (${m.currentQuiz})\n`);
  });

  if (dryRun) {
    console.log("Run without --dry-run to apply fixes.");
    return;
  }

  const quizzesByCategory = await db.quiz.findMany({
    include: { category: true },
  });

  const targetQuizByCategory = new Map<string, string>();
  for (const quiz of quizzesByCategory) {
    if (!targetQuizByCategory.has(quiz.category.slug)) {
      targetQuizByCategory.set(quiz.category.slug, quiz.id);
    }
  }

  let fixed = 0;
  for (const m of mismatches) {
    const targetQuizId = targetQuizByCategory.get(m.expectedCategory);
    if (!targetQuizId) {
      console.error(`No quiz found for category ${m.expectedCategory}, skipping question ${m.questionId}`);
      continue;
    }

    await db.question.update({
      where: { id: m.questionId },
      data: { quizId: targetQuizId },
    });
    fixed++;
  }

  console.log(`\nFixed ${fixed} question(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
