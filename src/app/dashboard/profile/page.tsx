import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ProfilePage from "@/components/pages/ProfilePage";

export const metadata = {
  title: "Profile | Canadian Citizenship",
  description: "Manage your profile and testimonial display info",
};

export default async function Profile() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, province: true, avatarUrl: true },
  });

  return (
    <ProfilePage
      initialData={{
        name: user?.name ?? "",
        province: user?.province ?? null,
        avatarUrl: user?.avatarUrl ?? "",
      }}
    />
  );
}
