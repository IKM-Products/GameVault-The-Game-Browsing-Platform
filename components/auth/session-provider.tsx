// components/auth/session-provider.tsx

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { useSession } from "@/lib/auth-client";

type SessionContextType = ReturnType<typeof useSession>;

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();

  return (
    <SessionContext.Provider value={session}>
      {session.isPending ? (
        <main className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      ) : (
        children
      )}
    </SessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used inside SessionProvider");
  }

  return context;
}