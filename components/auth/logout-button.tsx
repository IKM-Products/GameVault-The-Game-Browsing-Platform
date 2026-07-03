"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { signOut } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      const { error } = await signOut();

      if (error) {
        toast.error(error.message || "Failed to sign out.");
        return;
      }

      toast.success("Logged out successfully.");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="destructive"
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing Out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}