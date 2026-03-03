/**
 * Transforms citizenship_1000_questions_dataset JSON for examlbl import:
 * - Maps: answer→correctAnswer, category→topic, difficulty→capitalize
 * - Adds type: "single" (all questions are single-choice)
 * - Groups by category, outputs separate files per category (for proper quiz categorization)
 * - Splits large categories into batches of 500 (app limit)
 *
 * Usage: npx tsx scripts/transform-citizenship-import.ts <input.json> [output-dir]
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";

const BATCH_SIZE = 500;

/** Maps dataset category to app category slug (for filename) */
const CATEGORY_SLUG: Record<string, string> = {
  Government: "government",
  History: "history",
  "Rights and Responsibilities": "rights",
  Symbols: "symbols",
  Geography: "geography",
  "Provinces and Territories": "geography",
};

type InputItem = {
  id?: number;
  question: string;
  options: string[];
  answer: string;
  category: string;
  difficulty: string;
  explanation: string;
  province?: unknown;
};

type OutputQuestion = {
  type: "single";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

function capitalize(s: string): "Easy" | "Medium" | "Hard" {
  const lower = s.toLowerCase();
  if (lower === "easy") return "Easy";
  if (lower === "medium") return "Medium";
  if (lower === "hard") return "Hard";
  return "Medium";
}

function transform(item: InputItem): OutputQuestion {
  return {
    type: "single",
    question: item.question,
    options: item.options,
    correctAnswer: item.answer,
    explanation: item.explanation,
    topic: item.category || "General",
    difficulty: capitalize(item.difficulty),
  };
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function main() {
  const inputPath = process.argv[2];
  const outputDir = process.argv[3] ?? dirname(inputPath);

  if (!inputPath) {
    console.error("Usage: npx tsx scripts/transform-citizenship-import.ts <input.json> [output-dir]");
    process.exit(1);
  }

  const raw = readFileSync(inputPath, "utf-8");
  const data = JSON.parse(raw) as InputItem[];
  const items = Array.isArray(data) ? data : [];

  const byCategory = new Map<string, OutputQuestion[]>();
  for (const item of items) {
    const q = transform(item);
    const slug = CATEGORY_SLUG[item.category] ?? slugify(item.category);
    const list = byCategory.get(slug) ?? [];
    list.push(q);
    byCategory.set(slug, list);
  }

  mkdirSync(outputDir, { recursive: true });
  const baseName = "citizenship";
  const outputs: string[] = [];

  for (const [slug, questions] of byCategory) {
    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE);
      const suffix = questions.length > BATCH_SIZE ? `_batch${Math.floor(i / BATCH_SIZE) + 1}` : "";
      const name = `${baseName}_${slug}${suffix}.json`;
      const path = join(outputDir, name);
      writeFileSync(path, JSON.stringify({ questions: batch }, null, 2), "utf-8");
      outputs.push(path);
    }
  }

  const total = items.length;
  console.log(`Transformed ${total} questions into ${outputs.length} file(s) by category:`);
  outputs.forEach((p) => console.log(`  - ${p}`));
  console.log("\nImport: Create a quiz per category (e.g. Government, History), then import each file into its matching quiz.");
}

main();
