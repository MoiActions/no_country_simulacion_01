import { api } from "@/lib/api";
import type {
  JobOpportunity,
  Application,
  ProfessionalProfile,
} from "@/types";

export interface TalentSearchDto {
  skills?: string[];
  availability?: string;
  workType?: string;
  minExperience?: number;
}

export interface ApplicationFeedbackDto {
  rating: number;
  feedback: string;
  interviewNotes?: string;
}

export const marketplaceService = {
  getOpportunities: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters).toString();
    return api.get<JobOpportunity[]>(
      `/marketplace/opportunities${params ? `?${params}` : ""}`
    );
  },

  getOpportunity: (id: string) =>
    api.get<JobOpportunity>(`/marketplace/opportunities/${id}`),

  applyToJob: (opportunityId: string, coverLetter?: string) =>
    api.post<Application>(`/marketplace/opportunities/${opportunityId}/apply`, {
      coverLetter,
    }),

  getMyApplications: () =>
    api.get<Application[]>("/marketplace/applications"),

  searchTalent: (filters: TalentSearchDto) =>
    api.post<ProfessionalProfile[]>("/marketplace/talent/search", filters),

  getApplicationsForJob: (opportunityId: string) =>
    api.get<Application[]>(
      `/marketplace/opportunities/${opportunityId}/applications`
    ),

  updateApplicationStatus: (
    applicationId: string,
    status: string
  ) =>
    api.patch<Application>(`/marketplace/applications/${applicationId}/status`, {
      status,
    }),

  addFeedback: (applicationId: string, data: ApplicationFeedbackDto) =>
    api.post(`/marketplace/applications/${applicationId}/feedback`, data),

  addToShortlist: (candidateId: string, notes?: string) =>
    api.post("/marketplace/shortlist", { candidateId, notes }),

  getShortlist: () =>
    api.get<ProfessionalProfile[]>("/marketplace/shortlist"),
};
