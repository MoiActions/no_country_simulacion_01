"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { learningService, EvaluationSubmitDto } from "@/services/learning.service";

export function useLearningPaths() {
  return useQuery({
    queryKey: ["learning", "paths"],
    queryFn: () => learningService.getPaths(),
  });
}

export function useLearningPath(pathId: string) {
  return useQuery({
    queryKey: ["learning", "paths", pathId],
    queryFn: () => learningService.getPath(pathId),
    enabled: !!pathId,
  });
}

export function useLearningModule(moduleId: string) {
  return useQuery({
    queryKey: ["learning", "modules", moduleId],
    queryFn: () => learningService.getModule(moduleId),
    enabled: !!moduleId,
  });
}

export function useCompleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => learningService.completeContent(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning", "progress"] });
    },
  });
}

export function useCompleteCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checkpointId: string) =>
      learningService.completeCheckpoint(checkpointId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning", "progress"] });
    },
  });
}

export function useSubmitEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EvaluationSubmitDto) =>
      learningService.submitEvaluation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning"] });
    },
  });
}

export function useLearningProgress() {
  return useQuery({
    queryKey: ["learning", "progress"],
    queryFn: () => learningService.getProgress(),
  });
}

export function useValidatedSkills() {
  return useQuery({
    queryKey: ["learning", "validated-skills"],
    queryFn: () => learningService.getValidatedSkills(),
  });
}
