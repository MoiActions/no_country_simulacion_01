import { api } from "@/lib/api";
import type {
  DiagnosisTest,
  DiagnosisQuestion,
  DiagnosisResult,
  LearningPath,
} from "@/types";

export interface SubmitDiagnosisDto {
  testId: string;
  responses: Array<{
    questionId: string;
    selectedOptionIds: string[];
  }>;
}

export const diagnosisService = {
  getTests: () => api.get<DiagnosisTest[]>("/diagnosis/tests"),

  getTest: (testId: string) =>
    api.get<DiagnosisTest>(`/diagnosis/tests/${testId}`),

  getQuestions: (testId: string) =>
    api.get<DiagnosisQuestion[]>(`/diagnosis/tests/${testId}/questions`),

  submitTest: (data: SubmitDiagnosisDto) =>
    api.post<DiagnosisResult>("/diagnosis/submit", data),

  getResults: () => api.get<DiagnosisResult[]>("/diagnosis/results"),

  getLatestResult: () =>
    api.get<DiagnosisResult>("/diagnosis/results/latest"),

  getRecommendedPaths: () =>
    api.get<LearningPath[]>("/diagnosis/recommended-paths"),
};
