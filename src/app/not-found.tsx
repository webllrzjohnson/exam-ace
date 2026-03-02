import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <Link href="/" className="text-primary font-medium hover:underline">
        Back to home
      </Link>
    </div>
  );
}
