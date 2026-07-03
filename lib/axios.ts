import axios from 'axios';

interface IgdbConfig {
  clientId: string;
  clientSecret: string;
}

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface IgdbGameMetadata {
  provider_slug: string;
  name: string;
  summary?: string;
  storyline?: string;
  cover_url?: string;
  background_url?: string;
  genres: string[];
  developers: string[];
  publishers: string[];
  release_date?: Date;
  age_ratings?: number[];
  time_to_beat_minutes?: number;
  early_access: boolean;
}

export class IgdbProvider {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: IgdbConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  /**
   * Generates or refreshes OAuth2 token via Twitch Developer API
   */
  private async getValidToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    
    // Return cached token if it's still valid with a 60-second buffer
    if (this.accessToken && this.tokenExpiry > now + 60) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<TwitchTokenResponse>(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = now + response.data.expires_in;
      return this.accessToken;
    } catch (error: any) {
      throw new Error(`Failed to authenticate with Twitch/IGDB: ${error?.response?.data?.message || error.message}`);
    }
  }

  /**
   * Base request builder wrapper for executing raw IGDB queries
   */
  private async queryIgdb(endpoint: string, body: string): Promise<any[]> {
    const token = await this.getValidToken();

    const response = await axios.post(`https://api.igdb.com/v4/${endpoint}`, body, {
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
    });

    return response.data;
  }

  /**
   * Searches for a game on IGDB matching GameVault's structure properties
   */
  public async searchGame(title: string): Promise<IgdbGameMetadata[]> {
    // IGDB raw body format using Apicalipse syntax. 
    // Pulls game structures matching GameVault's explicit metadata requirements.
    const body = `
      search "${title}";
      fields name, summary, storyline, first_release_date, status,
             cover.image_id, artworks.image_id, screenshots.image_id,
             genres.name, age_ratings.rating,
             involved_companies.developer, involved_companies.publisher, involved_companies.company.name;
      limit 5;
    `;

    try {
      const rawGames = await this.queryIgdb('games', body);

      return rawGames.map((game: any) => {
        // Parse developers and publishers from the involved_companies list array
        const developers: string[] = [];
        const publishers: string[] = [];

        if (game.involved_companies) {
          game.involved_companies.forEach((ic: any) => {
            if (ic.company?.name) {
              if (ic.developer) developers.push(ic.company.name);
              if (ic.publisher) publishers.push(ic.company.name);
            }
          });
        }

        // Mapping Cover and Artwork assets using the highest resolution available (t_cover_big_2x)
        const cover_url = game.cover?.image_id 
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg` 
          : undefined;

        const background_url = game.artworks?.[0]?.image_id
          ? `https://images.igdb.com/igdb/image/upload/t_1080p/${game.artworks[0].image_id}.jpg`
          : game.screenshots?.[0]?.image_id
          ? `https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshots[0].image_id}.jpg`
          : undefined;

        // Map early access indicators from the enum statuses: alpha (2), beta (3), early_access (5)
        const early_access = [2, 3, 5].includes(game.status);

        return {
          provider_slug: 'igdb',
          name: game.name,
          summary: game.summary,
          storyline: game.storyline,
          cover_url,
          background_url,
          genres: game.genres?.map((g: any) => g.name) || [],
          developers,
          publishers,
          release_date: game.first_release_date ? new Date(game.first_release_date * 1000) : undefined,
          age_ratings: game.age_ratings?.map((ar: any) => ar.rating) || [],
          early_access,
        };
      });
    } catch (error: any) {
      console.error('IGDB metadata search error:', error?.response?.data || error.message);
      return [];
    }
  }
}