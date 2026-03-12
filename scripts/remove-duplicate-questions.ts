/**
 * Removes duplicate questions from the database.
 * Within each quiz, questions with identical text are deduplicated (keeps first by id).
 *
 * Usage: npx tsx scripts/remove-duplicate-questions.ts [--dry-run]
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

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("DRY RUN - no changes will be made\n");

  const questions = await db.question.findMany({
    include: { quiz: true },
    orderBy: { id: "asc" },
  });

  const byQuiz = new Map<string, typeof questions>();
  for (const q of questions) {
    const list = byQuiz.get(q.quizId) ?? [];
    list.push(q);
    byQuiz.set(q.quizId, list);
  }

  const toDelete: string[] = [];
  for (const [quizId, list] of byQuiz) {
    const seen = new Set<string>();
    for (const q of list) {
      const key = q.question.trim();
      if (seen.has(key)) {
        toDelete.push(q.id);
      } else {
        seen.add(key);
      }
    }
  }

  if (toDelete.length === 0) {
    console.log("No duplicate questions found.");
    return;
  }

  console.log(`Found ${toDelete.length} duplicate question(s) to remove.\n`);

  if (dryRun) {
    const sample = toDelete.slice(0, 5);
    const samples = await db.question.findMany({
      where: { id: { in: sample } },
      include: { quiz: true },
    });
    samples.forEach((q) => {
      console.log(`  - "${q.question.slice(0, 50)}..." (${q.quiz.title})`);
    });
    if (toDelete.length > 5) {
      console.log(`  ... and ${toDelete.length - 5} more`);
    }
    console.log("\nRun without --dry-run to delete.");
    return;
  }

  const result = await db.question.deleteMany({
    where: { id: { in: toDelete } },
  });

  console.log(`Deleted ${result.count} duplicate question(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
