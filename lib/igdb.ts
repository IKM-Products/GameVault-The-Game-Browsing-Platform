// lib/igdb.ts

import axios from "axios";

const IGDB_BASE_URL = "https://api.igdb.com/v4";

export const igdb = axios.create({
  baseURL: IGDB_BASE_URL,

  headers: {
    "Client-ID": process.env.IGDB_CLIENT_ID!,
    Authorization: `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "text/plain",
  },

  timeout: 10000,
});

export async function igdbRequest<T>(
  endpoint: string,
  query: string,
): Promise<T> {
  try {
    const { data } = await igdb.post<T>(endpoint, query);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("IGDB API Error:");
      console.error(error.response?.data);

      throw new Error(
        error.response?.data ||
          "Failed to fetch data from IGDB.",
      );
    }

    throw error;
  }
}