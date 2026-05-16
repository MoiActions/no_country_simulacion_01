import { api } from "@/lib/api";
import type {
  ProfessionalProfile,
  WorkExperience,
  Education,
} from "@/types";

export const profileService = {
  getFullProfile: () =>
    api.get<ProfessionalProfile>("/professional-profile/full"),

  getPublicProfile: (userId: string) =>
    api.get<ProfessionalProfile>(`/professional-profile/public/${userId}`),

  updatePitch: (pitch: string) =>
    api.patch<ProfessionalProfile>("/professional-profile/pitch", { pitch }),

  addWorkExperience: (data: Omit<WorkExperience, "id">) =>
    api.post<WorkExperience>("/professional-profile/work-experience", data),

  updateWorkExperience: (id: string, data: Partial<WorkExperience>) =>
    api.patch<WorkExperience>(
      `/professional-profile/work-experience/${id}`,
      data
    ),

  deleteWorkExperience: (id: string) =>
    api.delete(`/professional-profile/work-experience/${id}`),

  addEducation: (data: Omit<Education, "id">) =>
    api.post<Education>("/professional-profile/education", data),

  updateEducation: (id: string, data: Partial<Education>) =>
    api.patch<Education>(`/professional-profile/education/${id}`, data),

  deleteEducation: (id: string) =>
    api.delete(`/professional-profile/education/${id}`),
};
