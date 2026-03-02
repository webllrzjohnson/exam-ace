"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Quiz = { id: string; slug: string; title: string; questionCount: number };
type Question = { id: string; type: string; question: string; topic: string; difficulty: string };

export default function AdminQuestionsClient() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quizzes/list")
      .then((r) => (r.ok ? r.json() : []))
      .then(setQuizzes)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedQuiz) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    fetch(`/api/quizzes/list?quizId=${selectedQuiz.id}`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: { questions?: Question[] }) => setQuestions(data?.questions ?? []))
      .finally(() => setLoading(false));
  }, [selectedQuiz]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (res.ok && selectedQuiz) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setDeleteId(null);
    }
  };

  if (loading && !selectedQuiz) {
    return (
      <div className="container py-10">
        <div className="animate-pulse h-8 bg-muted rounded w-1/3 mb-4" />
        <div className="animate-pulse h-4 bg-muted rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manage Questions</h1>
      <p className="text-muted-foreground mb-8">Select a quiz to view, add, edit, or delete questions</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select
          value={selectedQuiz?.id ?? ""}
          onChange={(e) => {
            const q = quizzes.find((q) => q.id === e.target.value);
            setSelectedQuiz(q ?? null);
          }}
          className="px-4 py-2 rounded-lg border border-input bg-card text-foreground"
        >
          <option value="">Select a quiz...</option>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title} ({q.questionCount} questions)
            </option>
          ))}
        </select>
        {selectedQuiz && (
          <Link href={`/admin/questions/new?quizId=${selectedQuiz.id}`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </Link>
        )}
      </div>

      {selectedQuiz && (
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-sm font-semibold text-muted-foreground">
            Questions in {selectedQuiz.title}
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No questions yet.{" "}
              <Link href={`/admin/questions/new?quizId=${selectedQuiz.id}`} className="text-primary hover:underline">
                Add one
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {q.type} · {q.topic} · {q.difficulty}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/admin/questions/${q.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(q.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete question?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
