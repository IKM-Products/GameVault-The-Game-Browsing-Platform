// app/profile/edit/page.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ProfileEditForm } from "./profile-edit-form";

export default async function EditProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl">
      <ProfileEditForm
        defaultName={session.user.name || ""}
        defaultImage={session.user.image || ""}
      />
    </main>
  );
}