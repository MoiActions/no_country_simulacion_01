export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "professional" | "recruiter" | "admin";
  avatarUrl?: string;
  createdAt: string;
}

export interface DiagnosisTest {
  id: string;
  name: string;
  description: string;
  category: string;
  totalQuestions: number;
}

export interface DiagnosisQuestion {
  id: string;
  questionText: string;
  questionType: "single_choice" | "multiple_choice" | "scale";
  category: string;
  options: DiagnosisOption[];
}

export interface DiagnosisOption {
  id: string;
  optionText: string;
  value: number;
}

export interface DiagnosisResult {
  id: string;
  testId: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  areasToImprove: string[];
  completedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  modules: LearningModule[];
}

export interface LearningModule {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  estimatedMinutes: number;
  contents: LearningContent[];
}

export interface LearningContent {
  id: string;
  title: string;
  contentType: "video" | "reading" | "exercise" | "quiz";
  contentUrl?: string;
  durationMinutes: number;
  orderIndex: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  learningPathId: string;
  moduleId: string;
  contentId?: string;
  progressPercentage: number;
  status: "not_started" | "in_progress" | "completed";
  xpEarned: number;
}

export interface ValidatedSkill {
  id: string;
  skillId: string;
  skill: Skill;
  level: "basic" | "intermediate" | "advanced" | "expert";
  validatedAt: string;
  validationMethod: string;
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  user: User;
  headline?: string;
  bio?: string;
  pitch?: string;
  portfolioUrl?: string;
  phone?: string;
  location?: string;
  visibility: "public" | "private" | "recruiters_only";
  declaredSkills: string[];
  availability: "full_time" | "part_time" | "freelance" | "not_available";
  preferredWorkType: "remote" | "on_site" | "hybrid";
  validatedSkills: ValidatedSkill[];
  workExperiences: WorkExperience[];
  educations: Education[];
  completionScore: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface JobOpportunity {
  id: string;
  title: string;
  description: string;
  companyId: string;
  company?: Company;
  requiredSkills: string[];
  location?: string;
  workType: "remote" | "on_site" | "hybrid";
  employmentType: "full_time" | "part_time" | "freelance" | "internship";
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  isUrgent: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
}

export interface Application {
  id: string;
  userId: string;
  jobOpportunityId: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  coverLetter?: string;
  appliedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  category: string;
  earnedAt?: string;
  isLocked: boolean;
}
