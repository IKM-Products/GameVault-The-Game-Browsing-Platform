// app/reset-password/page.tsx

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Gamepad2, Lock } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        token,
        newPassword: password,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to reset password.");
        return;
      }

      toast.success("Password reset successfully. Please login.");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Gamepad2 className="h-7 w-7" />
          </div>

          <div>
            <CardTitle className="text-3xl font-bold">
              Reset Password
            </CardTitle>

            <CardDescription className="mt-2">
              Enter your new password to recover your GameVault account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-10"
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
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}