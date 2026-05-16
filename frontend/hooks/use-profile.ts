"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import type { WorkExperience, Education } from "@/types";

export function useFullProfile() {
  return useQuery({
    queryKey: ["profile", "full"],
    queryFn: () => profileService.getFullProfile(),
  });
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", "public", userId],
    queryFn: () => profileService.getPublicProfile(userId),
    enabled: !!userId,
  });
}

export function useUpdatePitch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pitch: string) => profileService.updatePitch(pitch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useAddWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<WorkExperience, "id">) =>
      profileService.addWorkExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkExperience> }) =>
      profileService.updateWorkExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useDeleteWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.deleteWorkExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useAddEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Education, "id">) =>
      profileService.addEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Education> }) =>
      profileService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
