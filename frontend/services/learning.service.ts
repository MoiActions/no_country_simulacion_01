import { api } from "@/lib/api";
import type {
  LearningPath,
  LearningModule,
  UserProgress,
  ValidatedSkill,
} from "@/types";

export interface EvaluationSubmitDto {
  moduleId: string;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
}

export const learningService = {
  getPaths: () => api.get<LearningPath[]>("/learning/paths"),

  getPath: (pathId: string) =>
    api.get<LearningPath>(`/learning/paths/${pathId}`),

  getModule: (moduleId: string) =>
    api.get<LearningModule>(`/learning/modules/${moduleId}`),

  completeContent: (contentId: string) =>
    api.post(`/learning/contents/${contentId}/complete`, {}),

  completeCheckpoint: (checkpointId: string) =>
    api.post(`/learning/checkpoints/${checkpointId}/complete`, {}),

  submitEvaluation: (data: EvaluationSubmitDto) =>
    api.post<{ passed: boolean; score: number }>(
      "/learning/evaluations/submit",
      data
    ),

  getProgress: () => api.get<UserProgress[]>("/learning/progress"),

  getValidatedSkills: () =>
    api.get<ValidatedSkill[]>("/learning/validated-skills"),
};
