// app/api/igdb/games/route.ts

import { NextResponse } from "next/server";

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

async function fetchIGDBGames(query: string) {
  const clientId = process.env.IGDB_CLIENT_ID;
  const accessToken = process.env.IGDB_ACCESS_TOKEN;

  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB_CLIENT_ID or IGDB_ACCESS_TOKEN.");
  }

  const response = await fetch(`${IGDB_BASE_URL}/games`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    body: query,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch games from IGDB.");
  }

  return response.json();
}

export async function GET() {
  try {
    const fields = `
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
    `;

    const trendingQuery = `
      ${fields}
      where cover != null
        & total_rating != null
        & first_release_date != null;
      sort total_rating desc;
      limit 10;
    `;

    const popularQuery = `
      ${fields}
      where cover != null
        & rating != null
        & first_release_date != null;
      sort rating_count desc;
      limit 10;
    `;

    const [trendingRaw, popularRaw] = await Promise.all([
      fetchIGDBGames(trendingQuery),
      fetchIGDBGames(popularQuery),
    ]);

    const trending = trendingRaw.map(transformGame);
    const popular = popularRaw.map(transformGame);

    return NextResponse.json({
      trending,
      popular,
    });
  } catch (error) {
    console.error("IGDB games API error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch IGDB games.",
      },
      {
        status: 500,
      },
    );
  }
}