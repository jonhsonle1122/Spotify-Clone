import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";

import { create } from "zustand";
interface MusicStore {
  songs: Song[];
  albums: Album[];
  currentAlbum: Album | null;
  isLoading: boolean;
  error: string | null;
  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
}
export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");

      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
      console.error("Error fetching albums:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);

      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
      console.error("Error fetching albums:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
