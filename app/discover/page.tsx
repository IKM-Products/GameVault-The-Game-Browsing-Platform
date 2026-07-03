// app/discover/page.tsx

import Link from "next/link";
import { Flame, Gamepad2, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/games/game-card";

async function getGames() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/igdb/games`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch games.");
  }

  return res.json();
}

export default async function DiscoverPage() {
  const { trending, popular } = await getGames();

  const featuredGame = trending[0];

  return (
    <main className="space-y-10">
      {/* Hero */}
      {featuredGame && (
        <section className="relative overflow-hidden rounded-3xl border">
          <img
            src={featuredGame.cover}
            alt={featuredGame.name}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 max-w-2xl space-y-6 p-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
              <Flame className="h-4 w-4" />
              Featured Game
            </span>

            <h1 className="text-5xl font-black">
              {featuredGame.name}
            </h1>

            <p className="text-muted-foreground">
              {featuredGame.summary}
            </p>

            <Button asChild>
              <Link href={`/games/${featuredGame.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary" />
          <h2 className="text-2xl font-bold">
            Trending Games
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {trending.map((game: any) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-primary" />
          <h2 className="text-2xl font-bold">
            Popular Games
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {popular.map((game: any) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ))}
        </div>
      </section>
    </main>
  );
}