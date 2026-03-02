"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, Clock, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import QuizCard from "@/components/QuizCard";

const stats = [
  { icon: BookOpen, value: "500+", label: "Practice Questions" },
  { icon: Users, value: "12,000+", label: "Students Passed" },
  { icon: CheckCircle, value: "95%", label: "Pass Rate" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
];

type Category = { id: string; name: string; icon: string; description: string; quizCount: number; color: string };
type Quiz = { id: string; title: string; description: string; category: string; categoryIcon: string; difficulty: string; questionCount: number; timeLimit: number; passRate: number; avgScore: number; topics: string[]; featured: boolean };

export default function HomePage({ categories, featured }: { categories: Category[]; featured: Quiz[] }) {
  return (
    <div>
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="container relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              🍁 #1 Canadian Citizenship Test Prep
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gradient">
              Pass Your Canadian Citizenship Test with Confidence
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
              Practice with real exam-style questions, get instant feedback, and track your progress. Join thousands who passed on their first try.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
              >
                Start Practicing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3 rounded-lg font-semibold text-base hover:bg-primary-foreground/10 transition-colors"
              >
                Browse All Quizzes
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-75">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">Quiz Categories</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Choose a category to start practicing. Each area covers key topics from the official citizenship test.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/quizzes?category=${cat.id}`}
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
              >
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-foreground mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{cat.description}</p>
                  <span className="text-xs font-medium text-primary">{cat.quizCount} quizzes →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Featured Quizzes</h2>
            <p className="text-muted-foreground">Most popular quizzes to get you started</p>
          </div>
          <Link href="/quizzes" className="text-primary font-medium text-sm hover:underline hidden sm:block">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="gradient-hero rounded-2xl p-10 md:p-14 text-center text-primary-foreground">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gradient">Ready to Become a Canadian Citizen?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Start your free practice today and join thousands of successful test-takers.</p>
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-3.5 rounded-lg font-bold text-base hover:opacity-90 transition-opacity"
          >
            Start Practicing Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
