// app/search/page.tsx

import { Search } from "lucide-react";

import { GameCard } from "@/components/games/game-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

async function searchGames(query: string) {
  if (!query.trim()) {
    return [];
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/igdb/search?q=${encodeURIComponent(
      query,
    )}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to search games.");
  }

  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const games = await searchGames(query);

  return (
    <main className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Search Games</h1>
        <p className="mt-2 text-muted-foreground">
          Search your favorite games from the IGDB database.
        </p>
      </section>

      <form action="/search" className="flex max-w-2xl gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search games..."
            className="pl-10"
          />
        </div>

        <Button type="submit">Search</Button>
      </form>

      {!query && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Start searching</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Type a game title above to find matching games.
            </p>
          </CardContent>
        </Card>
      )}

      {query && games.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No games found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;.
            </p>
          </CardContent>
        </Card>
      )}

      {games.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xl font-bold">
            Search Results for{" "}
            <span className="text-primary">&quot;{query}&quot;</span>
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {games.map((game: any) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}