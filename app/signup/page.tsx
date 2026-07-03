// app/signup/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Gamepad2, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  signupSchema,
  type SignupFormValues,
} from "@/schemas/auth-schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to create account.");
        return;
      }

      toast.success("Account created successfully! Please login.");

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="grid w-full max-w-5xl overflow-hidden border-border bg-card shadow-2xl md:grid-cols-2">
        <div className="relative hidden min-h-150 overflow-hidden bg-muted md:block">
          <img
            src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1470&auto=format&fit=crop"
            alt="Gaming background"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-background/30" />

          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Join GameVault
            </p>

            <h2 className="mt-2 text-3xl font-black text-foreground">
              Build Your Game Collection.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Create an account to discover games, save favorites, browse
              categories, and manage your personal vault.
            </p>
          </div>
        </div>

        <CardContent className="flex min-h-150 flex-col justify-center p-8 md:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Gamepad2 className="h-6 w-6" />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              Game<span className="text-primary">Vault</span>
            </span>
          </div>

          <CardHeader className="px-0 pb-6 pt-0">
            <CardTitle className="text-3xl font-bold">
              Create Account
            </CardTitle>

            <CardDescription>
              Sign up to start building your personal game vault.
            </CardDescription>
          </CardHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="pl-10"
                  {...form.register("name")}
                />
              </div>

              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="pl-10"
                  {...form.register("email")}
                />
              </div>

              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="px-10"
                  {...form.register("password")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isLoading}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}