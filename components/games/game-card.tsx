// components/games/game-card.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: {
    id: number;
    name: string;
    cover: string;
    rating?: number;
    first_release_date?: string;
    platforms?: string[];
  };
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <Card className="group overflow-hidden border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        {/* Cover */}
        <div className="relative aspect-3/4 overflow-hidden">
          <Image
            src={game.cover}
            alt={game.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

          {/* Rating */}
          {game.rating && (
            <Badge className="absolute right-3 top-3 gap-1">
              <Star className="h-3 w-3 fill-current" />
              {Math.round(game.rating)}
            </Badge>
          )}
        </div>

        {/* Details */}
        <CardContent className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
            {game.name}
          </h3>

          {game.first_release_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />

              <span>{game.first_release_date}</span>
            </div>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.platforms.slice(0, 3).map((platform) => (
                <Badge
                  key={platform}
                  variant="secondary"
                >
                  {platform}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}