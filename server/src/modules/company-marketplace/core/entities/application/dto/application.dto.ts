import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApplicationStatus } from '../../../../persistence/postgres/entities/application.orm.entity';
import { FeedbackType } from '../../../../persistence/postgres/entities/application-feedback.orm.entity';

export class ApplicationDto {
  id: string;
  userId: string;
  jobOpportunityId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  coverLetter?: string;
  appliedAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
}

export class ApplyToJobDto {
  @IsOptional()
  @IsString()
  coverLetter?: string;
}

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ApplicationFeedbackDto {
  id: string;
  applicationId: string;
  type: FeedbackType;
  message: string;
  skillsToImprove?: string[];
  createdAt: Date;
}

export class CreateFeedbackDto {
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillsToImprove?: string[];

  @IsOptional()
  isVisibleToCandidate?: boolean;
}

export class ShortlistCandidateDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class TalentSearchDto {
  skills?: string[];
  yearsExperienceMin?: number;
  yearsExperienceMax?: number;
  location?: string;
  availability?: string;
  page?: number;
  limit?: number;
}
