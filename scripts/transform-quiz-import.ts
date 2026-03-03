/**
 * Transforms discover_canada_quiz JSON for examlbl import:
 * - Maps letter answers (A, B, C, D) to full option text for single/multiple
 * - Splits into batches of 500 (app limit)
 * - Omits quizId (select quiz in admin UI before importing)
 *
 * Usage: npx tsx scripts/transform-quiz-import.ts <input.json> [output-dir]
 * Example: npx tsx scripts/transform-quiz-import.ts "D:\cursor\Questionnaires _ Citizenship\discover_canada_quiz_combined1000.json"
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";

const BATCH_SIZE = 500;

type Question = {
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  topic: string;
  difficulty: string;
  matchPairs?: { left: string; right: string }[];
};

function letterToOption(letter: string, options: string[]): string | null {
  const idx = letter.charCodeAt(0) - 65; // A=0, B=1, ...
  if (idx >= 0 && idx < options.length) return options[idx];
  return null;
}

function transformQuestion(q: Question): Question {
  if (q.type === "single" && q.options && typeof q.correctAnswer === "string") {
    const full = letterToOption(q.correctAnswer.trim(), q.options);
    if (full) return { ...q, correctAnswer: full };
  }
  if (q.type === "multiple" && q.options && Array.isArray(q.correctAnswer)) {
    const full = q.correctAnswer
      .map((l) => letterToOption(String(l).trim(), q.options!))
      .filter((x): x is string => x != null);
    if (full.length === q.correctAnswer.length) return { ...q, correctAnswer: full };
  }
  return q;
}

function main() {
  const inputPath = process.argv[2];
  const outputDir = process.argv[3] ?? dirname(inputPath);

  if (!inputPath) {
    console.error("Usage: npx tsx scripts/transform-quiz-import.ts <input.json> [output-dir]");
    process.exit(1);
  }

  const raw = readFileSync(inputPath, "utf-8");
  const data = JSON.parse(raw) as { quizId?: string; questions: Question[] };
  const questions = (data.questions ?? []).map(transformQuestion);

  mkdirSync(outputDir, { recursive: true });
  const baseName = inputPath.replace(/\.[^.]+$/, "").split(/[/\\]/).pop() ?? "quiz";

  const batches: Question[][] = [];
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    batches.push(questions.slice(i, i + BATCH_SIZE));
  }

  const outputs: string[] = [];
  batches.forEach((batch, i) => {
    const out = {
      questions: batch,
    };
    const name = batches.length > 1 ? `${baseName}_batch${i + 1}.json` : `${baseName}_transformed.json`;
    const path = join(outputDir, name);
    writeFileSync(path, JSON.stringify(out, null, 2), "utf-8");
    outputs.push(path);
  });

  console.log(`Transformed ${questions.length} questions into ${batches.length} file(s):`);
  outputs.forEach((p) => console.log(`  - ${p}`));
  console.log("\nImport: Select your quiz in Admin > Questions, then paste/upload each file.");
}

main();
