"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Crown, CheckCircle, Loader2 } from "lucide-react";

export default function UpgradeSuccessClient() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const refreshSession = async () => {
      await update();
      
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1500);
    };

    refreshSession();
  }, [update]);

  if (isRefreshing) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <div className="container max-w-md text-center px-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Activating your premium account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="container max-w-md text-center px-4">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Welcome to Premium
        </h1>
        <p className="text-muted-foreground mb-8">
          Your subscription is active. You now have full access to flashcards, simulations, review mode, and more.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
        >
          <Crown className="w-4 h-4" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
