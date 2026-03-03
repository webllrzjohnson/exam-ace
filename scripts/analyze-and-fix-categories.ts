/**
 * Comprehensive analysis and categorization of all questions.
 * 
 * This script:
 * 1. Analyzes all questions in the database
 * 2. Identifies which questions belong to which category based on topic/content
 * 3. Reports mismatches and missing categories
 * 4. Optionally fixes the categorization by moving questions to correct quizzes
 * 
 * Usage: npx tsx scripts/analyze-and-fix-categories.ts [--dry-run] [--fix]
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
  // Government & Politics
  Government: "government",
  "Federal Government": "government",
  "Provincial Government": "government",
  "Municipal Government": "government",
  "Political System": "government",
  Parliament: "government",
  Senate: "government",
  "House of Commons": "government",
  "Prime Minister": "government",
  "Prime Ministers": "government",
  Elections: "government",
  "Federal Elections": "government",
  Voting: "government",
  Democracy: "government",
  Constitution: "government",
  "Constitutional Monarchy": "government",
  Monarchy: "government",
  "Governor General": "government",
  "System of Government": "government",
  "Head of State": "government",
  
  // History
  History: "history",
  "Canadian History": "history",
  "Canada's History": "history",
  "Indigenous History": "history",
  "Aboriginal Peoples": "history",
  "First Nations": "history",
  "War of 1812": "history",
  "World War I": "history",
  "World War II": "history",
  Confederation: "history",
  "New France": "history",
  Exploration: "history",
  "Famous Canadians": "history",
  "Military History": "history",
  "Early History": "history",
  "Rights History": "history",
  "Modern Canada": "history",
  
  // Rights and Freedoms
  "Rights and Responsibilities": "rights",
  "Rights and Freedoms": "rights",
  "Human Rights": "rights",
  "Charter of Rights": "rights",
  "Canadian Charter": "rights",
  Charter: "rights",
  Citizenship: "rights",
  "Citizenship Rights": "rights",
  "Citizen Responsibilities": "rights",
  Responsibilities: "rights",
  "Applying for Citizenship": "rights",
  Equality: "rights",
  Freedom: "rights",
  "Freedom of Speech": "rights",
  "Freedom of Religion": "rights",
  Justice: "rights",
  "Justice System": "rights",
  "Legal Rights": "rights",
  "Rule of Law": "rights",
  "Mobility Rights": "rights",
  
  // Geography
  Geography: "geography",
  "Canadian Geography": "geography",
  Provinces: "geography",
  Territories: "geography",
  "Provinces and Territories": "geography",
  Regions: "geography",
  "Canada's Regions": "geography",
  "Atlantic Provinces": "geography",
  "Prairie Provinces": "geography",
  "Western Canada": "geography",
  "Northern Canada": "geography",
  "Central Canada": "geography",
  Capitals: "geography",
  "Provincial Capitals": "geography",
  Cities: "geography",
  Landmarks: "geography",
  "Natural Resources": "geography",
  Climate: "geography",
  
  // Symbols
  Symbols: "symbols",
  "National Symbols": "symbols",
  "Canadian Symbols": "symbols",
  Flag: "symbols",
  "National Flag": "symbols",
  Anthem: "symbols",
  "National Anthem": "symbols",
  "Coat of Arms": "symbols",
  Beaver: "symbols",
  "Maple Leaf": "symbols",
  
  // Economy & Industry
  Economy: "economy",
  "Canadian Economy": "economy",
  "Canada's Economy": "economy",
  Industry: "economy",
  Industries: "economy",
  Trade: "economy",
  "International Trade": "economy",
  Agriculture: "economy",
  Farming: "economy",
  Fishing: "economy",
  Forestry: "economy",
  Mining: "economy",
  Manufacturing: "economy",
  Technology: "economy",
  Energy: "economy",
  Oil: "economy",
  "Natural Gas": "economy",
  Resources: "economy",
  Business: "economy",
  Commerce: "economy",
  Labor: "economy",
  Employment: "economy",
  
  // Culture & Society
  Culture: "culture",
  "Canadian Culture": "culture",
  Society: "culture",
  "Multiculturalism": "culture",
  "Official Languages": "culture",
  "French Language": "culture",
  "English Language": "culture",
  Bilingualism: "culture",
  Immigration: "culture",
  "Indigenous Peoples": "culture",
  "Aboriginal Culture": "culture",
  Sports: "culture",
  Arts: "culture",
  "Canadian Arts": "culture",
  Literature: "culture",
  Music: "culture",
  "National Sports": "culture",
  Hockey: "culture",
  Lacrosse: "culture",
  "Who Are Canadians": "culture",
  "National Identity": "culture",
};

function getExpectedCategorySlug(topic: string): string | null {
  const normalized = topic.trim();
  
  if (TOPIC_TO_CATEGORY_SLUG[normalized]) {
    return TOPIC_TO_CATEGORY_SLUG[normalized];
  }
  
  const lowerTopic = normalized.toLowerCase();
  
  if (lowerTopic.includes("econom") || lowerTopic.includes("industr") || 
      lowerTopic.includes("trade") || lowerTopic.includes("agricultur") ||
      lowerTopic.includes("fish") || lowerTopic.includes("forest") ||
      lowerTopic.includes("mining") || lowerTopic.includes("manufactur") ||
      lowerTopic.includes("energy") || lowerTopic.includes("oil") ||
      lowerTopic.includes("business") || lowerTopic.includes("commerce")) {
    return "economy";
  }
  
  if (lowerTopic.includes("culture") || lowerTopic.includes("multicultural") ||
      lowerTopic.includes("language") || lowerTopic.includes("bilingual") ||
      lowerTopic.includes("sport") || lowerTopic.includes("art") ||
      lowerTopic.includes("hockey") || lowerTopic.includes("lacrosse")) {
    return "culture";
  }
  
  if (lowerTopic.includes("government") || lowerTopic.includes("parliament") ||
      lowerTopic.includes("election") || lowerTopic.includes("democra") ||
      lowerTopic.includes("prime minister") || lowerTopic.includes("senate")) {
    return "government";
  }
  
  if (lowerTopic.includes("history") || lowerTopic.includes("war") ||
      lowerTopic.includes("confederation") || lowerTopic.includes("exploration")) {
    return "history";
  }
  
  if (lowerTopic.includes("right") || lowerTopic.includes("freedom") ||
      lowerTopic.includes("charter") || lowerTopic.includes("citizenship") ||
      lowerTopic.includes("justice") || lowerTopic.includes("legal")) {
    return "rights";
  }
  
  if (lowerTopic.includes("geograph") || lowerTopic.includes("province") ||
      lowerTopic.includes("territor") || lowerTopic.includes("region") ||
      lowerTopic.includes("capital") || lowerTopic.includes("city")) {
    return "geography";
  }
  
  if (lowerTopic.includes("symbol") || lowerTopic.includes("flag") ||
      lowerTopic.includes("anthem") || lowerTopic.includes("beaver") ||
      lowerTopic.includes("maple leaf")) {
    return "symbols";
  }
  
  return null;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const shouldFix = process.argv.includes("--fix");
  
  console.log("=".repeat(80));
  console.log("QUESTION CATEGORIZATION ANALYSIS");
  console.log("=".repeat(80));
  if (dryRun) console.log("MODE: DRY RUN - no changes will be made\n");
  if (shouldFix && !dryRun) console.log("MODE: FIX - will update database\n");
  
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });
  
  console.log(`\nFound ${categories.length} categories:`);
  categories.forEach((c) => console.log(`  - ${c.name} (${c.slug})`));
  
  const quizzes = await db.quiz.findMany({
    include: {
      category: true,
      _count: { select: { questions: true } },
    },
    orderBy: { title: "asc" },
  });
  
  console.log(`\nFound ${quizzes.length} quizzes:`);
  quizzes.forEach((q) => {
    console.log(`  - ${q.title} → ${q.category.name} (${q._count.questions} questions)`);
  });
  
  const questions = await db.question.findMany({
    include: {
      quiz: { include: { category: true } },
    },
  });
  
  console.log(`\n${"=".repeat(80)}`);
  console.log(`TOTAL QUESTIONS: ${questions.length}`);
  console.log("=".repeat(80));
  
  const topicCounts = new Map<string, number>();
  const categoryDistribution = new Map<string, number>();
  const mismatches: Array<{
    questionId: string;
    questionPreview: string;
    topic: string;
    currentQuiz: string;
    currentCategory: string;
    expectedCategory: string | null;
  }> = [];
  
  for (const q of questions) {
    const count = topicCounts.get(q.topic) ?? 0;
    topicCounts.set(q.topic, count + 1);
    
    const catCount = categoryDistribution.get(q.quiz.category.slug) ?? 0;
    categoryDistribution.set(q.quiz.category.slug, catCount + 1);
    
    const expectedSlug = getExpectedCategorySlug(q.topic);
    const currentSlug = q.quiz.category.slug;
    
    if (expectedSlug && currentSlug !== expectedSlug) {
      mismatches.push({
        questionId: q.id,
        questionPreview: q.question.slice(0, 80) + (q.question.length > 80 ? "..." : ""),
        topic: q.topic,
        currentQuiz: q.quiz.title,
        currentCategory: currentSlug,
        expectedCategory: expectedSlug,
      });
    }
  }
  
  console.log("\n📊 CURRENT DISTRIBUTION BY CATEGORY:");
  console.log("-".repeat(80));
  const sortedDist = Array.from(categoryDistribution.entries()).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sortedDist) {
    const pct = ((count / questions.length) * 100).toFixed(1);
    console.log(`  ${cat.padEnd(20)} ${count.toString().padStart(5)} questions (${pct}%)`);
  }
  
  console.log("\n📚 TOPICS FOUND (top 30):");
  console.log("-".repeat(80));
  const sortedTopics = Array.from(topicCounts.entries()).sort((a, b) => b[1] - a[1]);
  for (const [topic, count] of sortedTopics.slice(0, 30)) {
    const expected = getExpectedCategorySlug(topic);
    const indicator = expected ? `→ ${expected}` : "→ ???";
    console.log(`  ${topic.padEnd(40)} ${count.toString().padStart(4)} ${indicator}`);
  }
  
  if (sortedTopics.length > 30) {
    console.log(`  ... and ${sortedTopics.length - 30} more topics`);
  }
  
  console.log("\n⚠️  MISMATCHED QUESTIONS:");
  console.log("-".repeat(80));
  
  if (mismatches.length === 0) {
    console.log("✅ No mismatches found! All questions are in the correct category.");
  } else {
    console.log(`Found ${mismatches.length} question(s) in wrong category:\n`);
    
    const mismatchByMove = new Map<string, number>();
    for (const m of mismatches) {
      const key = `${m.currentCategory} → ${m.expectedCategory}`;
      mismatchByMove.set(key, (mismatchByMove.get(key) ?? 0) + 1);
    }
    
    console.log("Summary by move:");
    for (const [move, count] of Array.from(mismatchByMove.entries()).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${move.padEnd(30)} ${count} questions`);
    }
    
    console.log("\nFirst 20 examples:");
    mismatches.slice(0, 20).forEach((m, i) => {
      console.log(`\n${i + 1}. "${m.questionPreview}"`);
      console.log(`   Topic: "${m.topic}"`);
      console.log(`   Current: ${m.currentCategory} (${m.currentQuiz})`);
      console.log(`   Expected: ${m.expectedCategory}`);
    });
    
    if (mismatches.length > 20) {
      console.log(`\n... and ${mismatches.length - 20} more mismatches`);
    }
  }
  
  console.log("\n🔍 QUESTIONS WITH UNMAPPED TOPICS:");
  console.log("-".repeat(80));
  const unmappedTopics = new Set<string>();
  for (const q of questions) {
    const expected = getExpectedCategorySlug(q.topic);
    if (!expected) {
      unmappedTopics.add(q.topic);
    }
  }
  
  if (unmappedTopics.size === 0) {
    console.log("✅ All topics are mapped to categories!");
  } else {
    console.log(`Found ${unmappedTopics.size} unmapped topic(s):`);
    const unmappedCounts = Array.from(unmappedTopics).map((topic) => ({
      topic,
      count: questions.filter((q) => q.topic === topic).length,
    })).sort((a, b) => b.count - a.count);
    
    for (const { topic, count } of unmappedCounts) {
      console.log(`  ${topic.padEnd(40)} ${count} questions`);
    }
  }
  
  if (shouldFix && !dryRun && mismatches.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("FIXING CATEGORIZATION...");
    console.log("=".repeat(80));
    
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
    let skipped = 0;
    
    for (const m of mismatches) {
      if (!m.expectedCategory) {
        skipped++;
        continue;
      }
      
      const targetQuizId = targetQuizByCategory.get(m.expectedCategory);
      if (!targetQuizId) {
        console.error(`❌ No quiz found for category ${m.expectedCategory}, skipping question ${m.questionId}`);
        skipped++;
        continue;
      }
      
      await db.question.update({
        where: { id: m.questionId },
        data: { quizId: targetQuizId },
      });
      fixed++;
      
      if (fixed % 100 === 0) {
        console.log(`  Fixed ${fixed} questions...`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} question(s).`);
    if (skipped > 0) {
      console.log(`⚠️  Skipped ${skipped} question(s) (no target quiz found).`);
    }
    
    const updatedDist = await db.quiz.findMany({
      include: {
        category: true,
        _count: { select: { questions: true } },
      },
      orderBy: { title: "asc" },
    });
    
    console.log("\n📊 UPDATED DISTRIBUTION:");
    console.log("-".repeat(80));
    updatedDist.forEach((q) => {
      console.log(`  ${q.category.name.padEnd(30)} ${q._count.questions.toString().padStart(5)} questions`);
    });
  } else if (mismatches.length > 0) {
    console.log("\n💡 To fix these issues, run: npx tsx scripts/analyze-and-fix-categories.ts --fix");
  }
  
  console.log("\n" + "=".repeat(80));
  console.log("ANALYSIS COMPLETE");
  console.log("=".repeat(80));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
