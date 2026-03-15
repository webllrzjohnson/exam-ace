import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type ContentPageLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function ContentPageLayout({ title, subtitle, children }: ContentPageLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 md:py-12 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>
        <header className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </header>
        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground">
          {children}
        </article>
      </div>
    </div>
  );
}
