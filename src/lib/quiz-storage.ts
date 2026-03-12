const QUIZ_RESULT_KEY = "quiz_result";
const QUIZ_REVIEW_KEY = "quiz_review";

export type MatchPair = { left: string; right: string };

export type QuizResultQuestion = {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | MatchPair[];
  matchPairs?: MatchPair[];
  explanation: string;
  topic: string;
  difficulty: string;
};

export type QuizResult = {
  quizId: string;
  answers: Record<string, string | string[] | MatchPair[]>;
  timeTaken: number;
  mode: string;
  questions?: QuizResultQuestion[];
};

export type QuizReview = {
  answers: Record<string, string | string[] | MatchPair[]>;
  wrongQuestions: Array<{
    id: string;
    type: string;
    question: string;
    options?: string[];
    correctAnswer: string | string[] | MatchPair[];
    matchPairs?: MatchPair[];
    explanation: string;
    topic: string;
    difficulty: string;
  }>;
  showAll?: boolean;
};

export function setQuizResult(data: QuizResult) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(data));
  }
}

export function getQuizResult(): QuizResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(QUIZ_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizResult;
  } catch {
    return null;
  }
}

export function clearQuizResult() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(QUIZ_RESULT_KEY);
  }
}

export function setQuizReview(data: QuizReview) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(QUIZ_REVIEW_KEY, JSON.stringify(data));
  }
}

export function getQuizReview(): QuizReview | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(QUIZ_REVIEW_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizReview;
  } catch {
    return null;
  }
}

export function clearQuizReview() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(QUIZ_REVIEW_KEY);
  }
}
