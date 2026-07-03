// app/profile/edit/profile-edit-form.tsx

"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Image, Save, User } from "lucide-react";
import { toast } from "sonner";

import {
  profileSchema,
  type ProfileFormValues,
} from "@/schemas/profile-schema";
import {
  updateProfileAction,
  type UpdateProfileState,
} from "@/actions/profile-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: UpdateProfileState = {
  success: false,
  message: "",
};

export function ProfileEditForm({
  defaultName,
  defaultImage,
}: {
  defaultName: string;
  defaultImage: string;
}) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultName,
      image: defaultImage,
    },
  });

  const image = watch("image");
  const name = watch("name");

  function onSubmit(values: ProfileFormValues) {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("image", values.image || "");

    startTransition(() => {
      formAction(formData);
    });
  }

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 800);
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Card className="border-border bg-card text-card-foreground shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Edit Profile
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-primary text-4xl font-bold text-primary-foreground shadow-xl">
              {image ? (
                <img
                  src={image}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                name?.charAt(0).toUpperCase() || "G"
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>

            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="name"
                disabled={isPending}
                placeholder="Enter your full name"
                className="pl-10"
                {...register("name")}
              />
            </div>

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>

            <div className="relative">
              <Image className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="image"
                disabled={isPending}
                placeholder="https://example.com/avatar.jpg"
                className="pl-10"
                {...register("image")}
              />
            </div>

            {errors.image && (
              <p className="text-sm text-destructive">
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.push("/profile")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}