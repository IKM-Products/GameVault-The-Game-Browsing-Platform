// app/api/igdb/categories/route.ts

import { NextResponse } from "next/server";

const IGDB_BASE_URL = "https://api.igdb.com/v4";

export async function GET() {
  try {
    const accessToken = process.env.IGDB_ACCESS_TOKEN;
    const clientId = process.env.IGDB_CLIENT_ID;

    if (!accessToken || !clientId) {
      return NextResponse.json(
        {
          message: "Missing IGDB environment variables.",
        },
        {
          status: 500,
        },
      );
    }

    const response = await fetch(`${IGDB_BASE_URL}/genres`, {
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
          slug;
        sort name asc;
        limit 100;
      `,
      cache: "force-cache",
    });

    if (!response.ok) {
      const error = await response.text();

      return NextResponse.json(
        {
          message: "Failed to fetch categories.",
          error,
        },
        {
          status: response.status,
        },
      );
    }

    const genres = await response.json();

    return NextResponse.json(genres);
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