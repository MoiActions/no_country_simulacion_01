"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  marketplaceService,
  TalentSearchDto,
  ApplicationFeedbackDto,
} from "@/services/marketplace.service";

export function useJobOpportunities(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["marketplace", "opportunities", filters],
    queryFn: () => marketplaceService.getOpportunities(filters),
  });
}

export function useJobOpportunity(id: string) {
  return useQuery({
    queryKey: ["marketplace", "opportunities", id],
    queryFn: () => marketplaceService.getOpportunity(id),
    enabled: !!id,
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      opportunityId,
      coverLetter,
    }: {
      opportunityId: string;
      coverLetter?: string;
    }) => marketplaceService.applyToJob(opportunityId, coverLetter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace", "applications"] });
    },
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["marketplace", "applications"],
    queryFn: () => marketplaceService.getMyApplications(),
  });
}

export function useSearchTalent() {
  return useMutation({
    mutationFn: (filters: TalentSearchDto) =>
      marketplaceService.searchTalent(filters),
  });
}

export function useApplicationsForJob(opportunityId: string) {
  return useQuery({
    queryKey: ["marketplace", "opportunities", opportunityId, "applications"],
    queryFn: () => marketplaceService.getApplicationsForJob(opportunityId),
    enabled: !!opportunityId,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => marketplaceService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
}

export function useAddFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: ApplicationFeedbackDto;
    }) => marketplaceService.addFeedback(applicationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
}

export function useAddToShortlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      candidateId,
      notes,
    }: {
      candidateId: string;
      notes?: string;
    }) => marketplaceService.addToShortlist(candidateId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace", "shortlist"] });
    },
  });
}

export function useShortlist() {
  return useQuery({
    queryKey: ["marketplace", "shortlist"],
    queryFn: () => marketplaceService.getShortlist(),
  });
}
