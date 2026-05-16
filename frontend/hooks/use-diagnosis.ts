"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { diagnosisService, SubmitDiagnosisDto } from "@/services/diagnosis.service";

export function useDiagnosisTests() {
  return useQuery({
    queryKey: ["diagnosis", "tests"],
    queryFn: () => diagnosisService.getTests(),
  });
}

export function useDiagnosisTest(testId: string) {
  return useQuery({
    queryKey: ["diagnosis", "tests", testId],
    queryFn: () => diagnosisService.getTest(testId),
    enabled: !!testId,
  });
}

export function useDiagnosisQuestions(testId: string) {
  return useQuery({
    queryKey: ["diagnosis", "questions", testId],
    queryFn: () => diagnosisService.getQuestions(testId),
    enabled: !!testId,
  });
}

export function useSubmitDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitDiagnosisDto) => diagnosisService.submitTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosis", "results"] });
    },
  });
}

export function useDiagnosisResults() {
  return useQuery({
    queryKey: ["diagnosis", "results"],
    queryFn: () => diagnosisService.getResults(),
  });
}

export function useLatestDiagnosisResult() {
  return useQuery({
    queryKey: ["diagnosis", "results", "latest"],
    queryFn: () => diagnosisService.getLatestResult(),
  });
}

export function useRecommendedPaths() {
  return useQuery({
    queryKey: ["diagnosis", "recommended-paths"],
    queryFn: () => diagnosisService.getRecommendedPaths(),
  });
}
