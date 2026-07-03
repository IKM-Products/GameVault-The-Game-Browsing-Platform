// app/games/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Gamepad2, Star } from "lucide-react";

import type { Game } from "@/types/game";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

async function getGame(id: string): Promise<Game> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/igdb/game/${id}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch game details.");
  }

  return res.json();
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);

  return (
    <main className="space-y-8">
      <Button asChild variant="outline" className="gap-2">
        <Link href="/discover">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        {game.artworks?.[0] || game.screenshots?.[0] || game.cover ? (
          <Image
            src={game.artworks?.[0] || game.screenshots?.[0] || game.cover}
            alt={game.name}
            fill
            priority
            className="object-cover opacity-30"
          />
        ) : null}

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/30" />

        <div className="relative z-10 grid gap-8 p-6 md:grid-cols-[260px_1fr] md:p-10">
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-border bg-muted">
            {game.cover ? (
              <Image
                src={game.cover}
                alt={game.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Cover
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end space-y-5">
            <div className="flex flex-wrap gap-2">
              {game.genres?.slice(0, 4).map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              {game.name}
            </h1>

            <p className="max-w-3xl leading-7 text-muted-foreground">
              {game.summary || "No summary available for this game."}
            </p>

            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              {game.rating ? (
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  {Math.round(game.rating)} Rating
                </span>
              ) : null}

              {game.first_release_date ? (
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {game.first_release_date}
                </span>
              ) : null}

              {game.platforms?.length ? (
                <span className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  {game.platforms.slice(0, 3).join(", ")}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-5 p-6">
            <h2 className="text-2xl font-bold">About This Game</h2>

            <p className="leading-7 text-muted-foreground">
              {game.storyline || game.summary || "No description available."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <h2 className="text-2xl font-bold">Game Info</h2>

            <div className="space-y-4 text-sm">
              <InfoRow label="Release Date" value={game.first_release_date} />
              <InfoRow label="Rating" value={game.rating ? `${Math.round(game.rating)}` : "N/A"} />
              <InfoRow label="Platforms" value={game.platforms?.join(", ")} />
              <InfoRow label="Genres" value={game.genres?.join(", ")} />
              <InfoRow label="Developers" value={game.developers?.join(", ")} />
              <InfoRow label="Publishers" value={game.publishers?.join(", ")} />
            </div>
          </CardContent>
        </Card>
      </section>

      {game.screenshots?.length ? (
        <section className="space-y-5">
          <h2 className="text-2xl font-bold">Screenshots</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {game.screenshots.slice(0, 6).map((screenshot) => (
              <div
                key={screenshot}
                className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted"
              >
                <Image
                  src={screenshot}
                  alt={game.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "N/A"}</p>
    </div>
  );
}