// types/game.ts

export interface Game {
  id: number;

  name: string;

  slug: string;

  summary: string;

  storyline?: string;

  rating?: number;

  aggregated_rating?: number;

  total_rating?: number;

  first_release_date: string;

  cover: string;

  screenshots: string[];

  artworks: string[];

  genres: string[];

  platforms: string[];

  developers: string[];

  publishers: string[];

  game_modes: string[];

  themes: string[];

  keywords: string[];

  videos: string[];

  websites: string[];

  age_ratings: string[];

  status?: string;

  popularity?: number;
}