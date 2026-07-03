// app/api/igdb/game/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

const IGDB_BASE_URL = "https://api.igdb.com/v4";
const IMAGE_BASE_URL = "https://images.igdb.com/igdb/image/upload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const accessToken = process.env.IGDB_ACCESS_TOKEN;
    const clientId = process.env.IGDB_CLIENT_ID;

    if (!accessToken || !clientId) {
      return NextResponse.json(
        {
          message: "Missing IGDB credentials.",
        },
        {
          status: 500,
        },
      );
    }

    const response = await fetch(`${IGDB_BASE_URL}/games`, {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: `
        fields
          id,
          name,
          slug,
          summary,
          storyline,
          rating,
          aggregated_rating,
          total_rating,
          first_release_date,
          cover.image_id,
          artworks.image_id,
          screenshots.image_id,
          genres.name,
          platforms.name,
          involved_companies.company.name,
          involved_companies.developer,
          involved_companies.publisher,
          game_modes.name,
          themes.name,
          keywords.name,
          videos.video_id,
          websites.url,
          age_ratings.rating,
          status.name,
          popularity;
        where id = ${id};
        limit 1;
      `,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();

      return NextResponse.json(
        {
          message: "Failed to fetch game.",
          error,
        },
        {
          status: response.status,
        },
      );
    }

    const data = await response.json();

    if (!data.length) {
      return NextResponse.json(
        {
          message: "Game not found.",
        },
        {
          status: 404,
        },
      );
    }

    const game = data[0];

    const transformedGame = {
      id: game.id,

      name: game.name,

      slug: game.slug,

      summary: game.summary ?? "",

      storyline: game.storyline ?? "",

      rating: game.rating ?? 0,

      aggregated_rating: game.aggregated_rating ?? 0,

      total_rating: game.total_rating ?? 0,

      first_release_date: game.first_release_date
        ? new Date(game.first_release_date * 1000)
            .toISOString()
            .split("T")[0]
        : "",

      cover: game.cover
        ? `${IMAGE_BASE_URL}/t_cover_big/${game.cover.image_id}.jpg`
        : "",

      artworks:
        game.artworks?.map(
          (artwork: { image_id: string }) =>
            `${IMAGE_BASE_URL}/t_1080p/${artwork.image_id}.jpg`,
        ) ?? [],

      screenshots:
        game.screenshots?.map(
          (screenshot: { image_id: string }) =>
            `${IMAGE_BASE_URL}/t_1080p/${screenshot.image_id}.jpg`,
        ) ?? [],

      genres:
        game.genres?.map(
          (genre: { name: string }) => genre.name,
        ) ?? [],

      platforms:
        game.platforms?.map(
          (platform: { name: string }) => platform.name,
        ) ?? [],

      developers:
        game.involved_companies
          ?.filter(
            (company: {
              developer: boolean;
            }) => company.developer,
          )
          .map(
            (company: {
              company: { name: string };
            }) => company.company.name,
          ) ?? [],

      publishers:
        game.involved_companies
          ?.filter(
            (company: {
              publisher: boolean;
            }) => company.publisher,
          )
          .map(
            (company: {
              company: { name: string };
            }) => company.company.name,
          ) ?? [],

      game_modes:
        game.game_modes?.map(
          (mode: { name: string }) => mode.name,
        ) ?? [],

      themes:
        game.themes?.map(
          (theme: { name: string }) => theme.name,
        ) ?? [],

      keywords:
        game.keywords?.map(
          (keyword: { name: string }) => keyword.name,
        ) ?? [],

      videos:
        game.videos?.map(
          (video: { video_id: string }) =>
            `https://www.youtube.com/watch?v=${video.video_id}`,
        ) ?? [],

      websites:
        game.websites?.map(
          (website: { url: string }) => website.url,
        ) ?? [],

      age_ratings:
        game.age_ratings?.map(
          (rating: { rating: number }) => rating.rating.toString(),
        ) ?? [],

      status: game.status?.name ?? "",

      popularity: game.popularity ?? 0,
    };

    return NextResponse.json(transformedGame);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error.",
      },
      {
        status: 500,
      },
    );
  }
}