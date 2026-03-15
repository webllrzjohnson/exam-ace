import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SubscriptionPage from "@/components/pages/SubscriptionPage";

export const metadata = {
  title: "Manage Subscription | Canadian Citizenship",
  description: "Manage your premium subscription",
};

export default async function Subscription() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <SubscriptionPage />;
}
