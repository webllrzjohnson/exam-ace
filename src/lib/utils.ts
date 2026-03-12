import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deduplicateByContent<T extends { id: string; question: string }>(
  questions: T[]
): T[] {
  const seen = new Set<string>();
  return questions.filter((q) => {
    const key = q.question.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Checks if a fill-in-the-blank answer is correct. Accepts the core answer when
 * the stored correct answer includes parenthetical clarifications (e.g. "Sovereign's (King's / Queen's)").
 */
export function isMatchingAnswerCorrect(
  userAnswer: { left: string; right: string }[],
  correctAnswer: { left: string; right: string }[]
): boolean {
  if (userAnswer.length !== correctAnswer.length) return false;
  const correctSet = new Set(correctAnswer.map((p) => `${p.left}|${p.right}`));
  return userAnswer.every((p) => correctSet.has(`${p.left}|${p.right}`));
}

export function isFillAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  const normalized = (s: string) => s.trim().toLowerCase();
  const user = normalized(userAnswer);
  const correct = normalized(correctAnswer);
  if (user === correct) return true;
  const parenIdx = correct.indexOf("(");
  if (parenIdx < 0) return false;
  const coreCorrect = correct.substring(0, parenIdx).trim();
  return coreCorrect.length > 0 && user === normalized(coreCorrect);
}
