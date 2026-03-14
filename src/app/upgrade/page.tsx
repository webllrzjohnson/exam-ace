import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UpgradePage from "@/components/pages/UpgradePage";

export const metadata = {
  title: "Upgrade to Premium | Canadian Citizenship",
  description: "Unlock unlimited quizzes, flashcards, simulations, and more",
};

export default async function Upgrade() {
  const session = await auth();

  if (session?.user?.subscriptionTier === "premium" || session?.user?.role === "admin") {
    redirect("/dashboard");
  }

  return <UpgradePage />;
}
