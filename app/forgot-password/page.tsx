// app/forgot-password/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, Gamepad2, CheckCircle2 } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      // FIX: Removed the non-existent ".auth" property call
      const result = await authClient.resetPassword({
        email: trimmedEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result?.error) {
        toast.error(result.error.message || "Unable to send reset email.");
        return;
      }

      toast.success("Password reset link has been sent to your email.");
      setIsSubmitted(true);
      setEmail("");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {isSubmitted ? (
              <CheckCircle2 className="h-7 w-7" />
            ) : (
              <Gamepad2 className="h-7 w-7" />
            )}
          </div>

          <div>
            <CardTitle className="text-3xl font-bold">
              {isSubmitted ? "Check your email" : "Forgot Password"}
            </CardTitle>

            <CardDescription className="mt-2">
              {isSubmitted
                ? "We have sent a password reset link to your email address if an account exists."
                : "Enter your email address and we'll send you a password reset link."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link href="/login" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/login">Return to Login</Link>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)} 
                className="w-full"
              >
                Resend email link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}