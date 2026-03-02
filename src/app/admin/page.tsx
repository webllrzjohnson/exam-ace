import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { FileQuestion, Plus } from "lucide-react";

export const metadata = {
  title: "Admin | Canadian Citizenship",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Admin</h1>
      <p className="text-muted-foreground mb-8">Manage questions and quizzes</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/questions"
          className="flex items-center gap-4 p-6 rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="p-3 rounded-lg bg-primary/10">
            <FileQuestion className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">Manage Questions</h2>
            <p className="text-sm text-muted-foreground">Add, edit, or delete quiz questions</p>
          </div>
          <Plus className="w-5 h-5 ml-auto text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
