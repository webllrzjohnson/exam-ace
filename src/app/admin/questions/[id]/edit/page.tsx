import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import QuestionForm from "../../question-form";

export const metadata = {
  title: "Edit Question | Admin",
};

export default async function EditQuestionPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin/questions");
  }
  const { id } = params;
  return <QuestionForm questionId={id} />;
}
