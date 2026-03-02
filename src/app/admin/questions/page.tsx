import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminQuestionsClient from "./admin-questions-client";

export const metadata = {
  title: "Manage Questions | Admin",
};

export default async function AdminQuestionsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin/questions");
  }

  return <AdminQuestionsClient />;
}
