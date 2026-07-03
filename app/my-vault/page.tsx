// app/my-vault/page.tsx

"use client";

import { Heart } from "lucide-react";

import { useVaultStore } from "@/stores/vault-store";

import { GameCard } from "@/components/games/game-card";
import { Card, CardContent } from "@/components/ui/card";

export default function MyVaultPage() {
  const { games } = useVaultStore();

  return (
    <main className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          My Vault
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your personal collection of saved games.
        </p>
      </section>

      {/* Empty State */}
      {games.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="mb-5 h-14 w-14 text-muted-foreground" />

            <h2 className="text-2xl font-semibold">
              Your Vault is Empty
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Save your favorite games while browsing and they'll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Count */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Saved Games
            </h2>

            <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
              {games.length} {games.length === 1 ? "Game" : "Games"}
            </span>
          </div>

          {/* Games */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}