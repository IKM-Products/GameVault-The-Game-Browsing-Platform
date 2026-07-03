// stores/vault-store.ts

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Game } from "@/types/game";

interface VaultStore {
  games: Game[];
  addGame: (game: Game) => void;
  removeGame: (gameId: number) => void;
  toggleGame: (game: Game) => void;
  isSaved: (gameId: number) => boolean;
  clearVault: () => void;
}

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      games: [],

      addGame: (game) => {
        const exists = get().games.some((item) => item.id === game.id);

        if (exists) return;

        set({
          games: [...get().games, game],
        });
      },

      removeGame: (gameId) => {
        set({
          games: get().games.filter((game) => game.id !== gameId),
        });
      },

      toggleGame: (game) => {
        const exists = get().games.some((item) => item.id === game.id);

        if (exists) {
          get().removeGame(game.id);
        } else {
          get().addGame(game);
        }
      },

      isSaved: (gameId) => {
        return get().games.some((game) => game.id === gameId);
      },

      clearVault: () => {
        set({ games: [] });
      },
    }),
    {
      name: "gamevault-storage",
    },
  ),
);