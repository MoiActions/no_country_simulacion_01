import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => {
        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
        } else {
          localStorage.removeItem("access_token");
        }
        set({ accessToken });
      },
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        localStorage.removeItem("access_token");
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
