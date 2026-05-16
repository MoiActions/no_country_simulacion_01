import { api } from "@/lib/api";
import type { User } from "@/types";

export const authService = {
  getMe: () => api.get<User>("/auth/me"),

  verifyToken: () =>
    api.get<{ valid: boolean; user: User }>("/auth/verify"),
};
