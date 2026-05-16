"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User, ProfessionalProfile } from "@/types";

export function useUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => api.get<User>("/users/me"),
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["profile", "full"],
    queryFn: () => api.get<ProfessionalProfile>("/professional-profile/full"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => api.patch<User>("/users/me", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProfessionalProfile>) =>
      api.patch<ProfessionalProfile>("/professional-profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
