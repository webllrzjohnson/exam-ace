import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import QuestionForm from "../question-form";

export const metadata = {
  title: "Add Question | Admin",
};

export default async function NewQuestionPage({
  searchParams,
}: {
  searchParams: { quizId?: string };
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin/questions/new");
  }
  const { quizId } = searchParams;
  return <QuestionForm quizId={quizId ?? ""} />;
}
