// app/api/igdb/search/route.ts

import { NextRequest, NextResponse } from "next/server";

const IGDB_BASE_URL = "https://api.igdb.com/v4";
const IMAGE_BASE_URL = "https://images.igdb.com/igdb/image/upload";

type IGDBGame = {
  id: number;
  name: string;
  slug?: string;
  summary?: string;
  rating?: number;
  total_rating?: number;
  first_release_date?: number;
  cover?: {
    image_id: string;
  };
  genres?: {
    name: string;
  }[];
  platforms?: {
    name: string;
  }[];
};

function transformGame(game: IGDBGame) {
  return {
    id: game.id,
    name: game.name,
    slug: game.slug || "",
    summary: game.summary || "",
    rating: game.total_rating || game.rating || 0,
    first_release_date: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
      : "",
    cover: game.cover
      ? `${IMAGE_BASE_URL}/t_cover_big/${game.cover.image_id}.jpg`
      : "",
    genres: game.genres?.map((genre) => genre.name) || [],
    platforms: game.platforms?.map((platform) => platform.name) || [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.IGDB_CLIENT_ID;
    const accessToken = process.env.IGDB_ACCESS_TOKEN;

    if (!clientId || !accessToken) {
      return NextResponse.json(
        { message: "Missing IGDB_CLIENT_ID or IGDB_ACCESS_TOKEN." },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json([]);
    }

    const response = await fetch(`${IGDB_BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: `
        search "${query.replaceAll('"', '\\"')}";
        fields
          id,
          name,
          slug,
          summary,
          rating,
          total_rating,
          first_release_date,
          cover.image_id,
          genres.name,
          platforms.name;
        where cover != null;
        limit 20;
      `,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();

      return NextResponse.json(
        {
          message: "Failed to search games.",
          error,
        },
        {
          status: response.status,
        },
      );
    }

    const games: IGDBGame[] = await response.json();

    return NextResponse.json(games.map(transformGame));
  } catch (error) {
    console.error("IGDB search API error:", error);

    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 },
    );
  }
}