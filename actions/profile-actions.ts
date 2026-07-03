// actions/profile-actions.ts

"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/schemas/profile-schema";

export type UpdateProfileState = {
  success: boolean;
  message: string;
};

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to update your profile.",
    };
  }

  const rawData = {
    name: String(formData.get("name") || ""),
    image: String(formData.get("image") || ""),
  };

  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        validatedFields.error.issues[0]?.message ||
        "Invalid profile data.",
    };
  }

  const { name, image } = validatedFields.data;

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        image: image ? (image.trim() === "" ? null : image) : null,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update profile:", error);

    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}