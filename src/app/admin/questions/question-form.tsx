"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const QuestionSchema = z.object({
  quizId: z.string().min(1, "Select a quiz"),
  type: z.enum(["single", "multiple", "boolean", "fill", "matching"]),
  question: z.string().min(1, "Question is required"),
  options: z.string().optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  correctAnswersMultiple: z.string().optional(),
  explanation: z.string().min(1, "Explanation is required"),
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

type QuestionInput = z.infer<typeof QuestionSchema>;

type Quiz = { id: string; slug: string; title: string };

export default function QuestionForm({
  quizId: initialQuizId,
  questionId,
}: {
  quizId?: string;
  questionId?: string;
}) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(!!questionId);

  const form = useForm<QuestionInput>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      quizId: initialQuizId ?? "",
      type: "single",
      question: "",
      options: "",
      correctAnswer: "",
      correctAnswersMultiple: "",
      explanation: "",
      topic: "",
      difficulty: "Easy",
    },
  });

  useEffect(() => {
    fetch("/api/quizzes/list")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setQuizzes(Array.isArray(data) ? data : []);
        if (initialQuizId && !form.getValues("quizId")) {
          form.setValue("quizId", initialQuizId);
        }
      });
  }, [initialQuizId, form]);

  useEffect(() => {
    if (!questionId) return;
    fetch(`/api/questions/${questionId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((q) => {
        if (q) {
          form.reset({
            quizId: q.quizId,
            type: q.type,
            question: q.question,
            options: Array.isArray(q.options) ? q.options.join("\n") : "",
            correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : String(q.correctAnswer),
            correctAnswersMultiple: Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : "",
            explanation: q.explanation,
            topic: q.topic,
            difficulty: q.difficulty,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [questionId, form]);

  const onSubmit = async (values: QuestionInput) => {
    const options = values.options
      ? values.options
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      : undefined;
    const correctAnswer =
      values.type === "multiple"
        ? (values.correctAnswersMultiple ?? values.correctAnswer)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : values.correctAnswer;

    const body = {
      quizId: values.quizId,
      type: values.type,
      question: values.question,
      options,
      correctAnswer,
      explanation: values.explanation,
      topic: values.topic,
      difficulty: values.difficulty,
    };

    if (questionId) {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) router.push("/admin/questions");
    } else {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) router.push("/admin/questions");
    }
  };

  const type = form.watch("type");

  if (loading && questionId) {
    return <div className="container py-10">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-10">
      <Link
        href="/admin/questions"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to questions
      </Link>

      <h1 className="font-display text-2xl font-bold text-foreground mb-8">
        {questionId ? "Edit Question" : "Add Question"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="quizId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!!questionId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quiz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {quizzes.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single choice</SelectItem>
                    <SelectItem value="multiple">Multiple choice</SelectItem>
                    <SelectItem value="boolean">True/False</SelectItem>
                    <SelectItem value="fill">Fill in the blank</SelectItem>
                    <SelectItem value="matching">Matching</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(type === "single" || type === "multiple" || type === "boolean") && (
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Options (one per line)</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Option A&#10;Option B&#10;Option C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {type === "multiple" ? (
            <FormField
              control={form.control}
              name="correctAnswersMultiple"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct answers (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Option A, Option C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct answer</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : questionId ? "Update" : "Create"}
            </Button>
            <Link href="/admin/questions">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
