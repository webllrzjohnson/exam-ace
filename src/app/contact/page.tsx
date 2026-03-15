import Link from "next/link";
import { ChevronLeft, Mail, User } from "lucide-react";

export const metadata = {
  title: "Contact | Canadian Citizenship Test Prep",
  description:
    "Get in touch with the Canadian Citizenship Test Prep team for questions, feedback, or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 md:py-12 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>
        <header className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Contact
          </h1>
          <p className="text-muted-foreground">
            Have questions, feedback, or need help? Reach out to us.
          </p>
        </header>

        <div className="space-y-4">
          <a
            href="mailto:pythondev28@outlook.com"
            className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admin Email</p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                pythondev28@outlook.com
              </p>
            </div>
          </a>
          <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Developer</p>
              <p className="font-semibold text-foreground">Sr. Superintendent Lester</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          We typically respond within 1–2 business days. For urgent subscription or payment issues,
          please include your email address in your message.
        </p>
      </div>
    </div>
  );
}
