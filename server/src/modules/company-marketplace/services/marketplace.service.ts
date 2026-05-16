import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In, Between } from 'typeorm';
import {
  ApplicationOrmEntity,
  ApplicationStatus,
} from '../persistence/postgres/entities/application.orm.entity';
import { ApplicationFeedbackOrmEntity } from '../persistence/postgres/entities/application-feedback.orm.entity';
import { CandidateShortlistOrmEntity } from '../persistence/postgres/entities/candidate-shortlist.orm.entity';
import { JobOpportunityOrmEntity } from '../persistence/postgres/entities/job-opportunity.orm.entity';
import { CompanyOrmEntity } from '../persistence/postgres/entities/company.orm.entity';
import { ProfessionalProfileOrmEntity } from '../../professional-profile/persistence/postgres/entities/professional-profile.orm.entity';
import {
  ApplyToJobDto,
  UpdateApplicationStatusDto,
  CreateFeedbackDto,
  ShortlistCandidateDto,
  TalentSearchDto,
  ApplicationDto,
  ApplicationFeedbackDto,
} from '../core/entities/application/dto/application.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(ApplicationOrmEntity)
    private readonly applicationRepository: Repository<ApplicationOrmEntity>,
    @InjectRepository(ApplicationFeedbackOrmEntity)
    private readonly feedbackRepository: Repository<ApplicationFeedbackOrmEntity>,
    @InjectRepository(CandidateShortlistOrmEntity)
    private readonly shortlistRepository: Repository<CandidateShortlistOrmEntity>,
    @InjectRepository(JobOpportunityOrmEntity)
    private readonly jobRepository: Repository<JobOpportunityOrmEntity>,
    @InjectRepository(CompanyOrmEntity)
    private readonly companyRepository: Repository<CompanyOrmEntity>,
    @InjectRepository(ProfessionalProfileOrmEntity)
    private readonly profileRepository: Repository<ProfessionalProfileOrmEntity>,
  ) {}

  async applyToJob(
    userId: string,
    jobId: string,
    dto: ApplyToJobDto,
  ): Promise<ApplicationDto> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['company'],
    });
    if (!job) {
      throw new NotFoundException('Job opportunity not found');
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: { userId, jobOpportunityId: jobId },
    });
    if (existingApplication) {
      throw new ConflictException('You have already applied to this job');
    }

    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    const application = this.applicationRepository.create({
      userId,
      jobOpportunityId: jobId,
      coverLetter: dto.coverLetter,
      profileSnapshot: profile ? this.createProfileSnapshot(profile) : undefined,
    });

    const saved = await this.applicationRepository.save(application);
    return this.mapApplicationToDto(saved, job);
  }

  async getUserApplications(userId: string): Promise<ApplicationDto[]> {
    const applications = await this.applicationRepository.find({
      where: { userId },
      relations: ['jobOpportunity'],
      order: { appliedAt: 'DESC' },
    });

    return Promise.all(
      applications.map(async (app) => {
        const job = await this.jobRepository.findOne({
          where: { id: app.jobOpportunityId },
          relations: ['company'],
        });
        return this.mapApplicationToDto(app, job!);
      }),
    );
  }

  async getApplicationById(
    applicationId: string,
    userId: string,
  ): Promise<ApplicationDto> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['jobOpportunity'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    const job = await this.jobRepository.findOne({
      where: { id: application.jobOpportunityId },
      relations: ['company'],
    });

    return this.mapApplicationToDto(application, job!);
  }

  async getApplicationFeedback(
    applicationId: string,
    userId: string,
  ): Promise<ApplicationFeedbackDto[]> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const feedbacks = await this.feedbackRepository.find({
      where: { applicationId, isVisibleToCandidate: true },
      order: { createdAt: 'DESC' },
    });

    return feedbacks.map((f) => ({
      id: f.id,
      applicationId: f.applicationId,
      type: f.type,
      message: f.message,
      skillsToImprove: f.skillsToImprove,
      createdAt: f.createdAt,
    }));
  }

  async withdrawApplication(applicationId: string, userId: string): Promise<void> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status === ApplicationStatus.HIRED) {
      throw new BadRequestException('Cannot withdraw a hired application');
    }

    application.status = ApplicationStatus.WITHDRAWN;
    await this.applicationRepository.save(application);
  }

  async getJobApplications(
    recruiterId: string,
    jobId: string,
  ): Promise<ApplicationDto[]> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['company'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const applications = await this.applicationRepository.find({
      where: { jobOpportunityId: jobId },
      order: { appliedAt: 'DESC' },
    });

    return applications.map((app) => this.mapApplicationToDto(app, job));
  }

  async updateApplicationStatus(
    recruiterId: string,
    applicationId: string,
    dto: UpdateApplicationStatusDto,
  ): Promise<ApplicationDto> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    application.status = dto.status;
    application.notes = dto.notes || application.notes;
    application.reviewedAt = new Date();

    const saved = await this.applicationRepository.save(application);

    const job = await this.jobRepository.findOne({
      where: { id: application.jobOpportunityId },
      relations: ['company'],
    });

    return this.mapApplicationToDto(saved, job!);
  }

  async addFeedback(
    recruiterId: string,
    applicationId: string,
    dto: CreateFeedbackDto,
  ): Promise<ApplicationFeedbackDto> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const feedback = this.feedbackRepository.create({
      applicationId,
      recruiterId,
      type: dto.type,
      message: dto.message,
      skillsToImprove: dto.skillsToImprove,
      isVisibleToCandidate: dto.isVisibleToCandidate ?? true,
    });

    const saved = await this.feedbackRepository.save(feedback);

    return {
      id: saved.id,
      applicationId: saved.applicationId,
      type: saved.type,
      message: saved.message,
      skillsToImprove: saved.skillsToImprove,
      createdAt: saved.createdAt,
    };
  }

  async searchTalent(
    recruiterId: string,
    searchDto: TalentSearchDto,
  ): Promise<{
    profiles: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = searchDto.page || 1;
    const limit = searchDto.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.profileRepository.createQueryBuilder('profile');

    if (searchDto.location) {
      queryBuilder.andWhere('profile.location ILIKE :location', {
        location: `%${searchDto.location}%`,
      });
    }

    if (searchDto.yearsExperienceMin !== undefined) {
      queryBuilder.andWhere('profile.yearsExperience >= :minYears', {
        minYears: searchDto.yearsExperienceMin,
      });
    }

    if (searchDto.yearsExperienceMax !== undefined) {
      queryBuilder.andWhere('profile.yearsExperience <= :maxYears', {
        maxYears: searchDto.yearsExperienceMax,
      });
    }

    if (searchDto.availability) {
      queryBuilder.andWhere('profile.availability = :availability', {
        availability: searchDto.availability,
      });
    }

    const [profiles, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('profile.completionScore', 'DESC')
      .getManyAndCount();

    return {
      profiles: profiles.map((p) => ({
        id: p.id,
        userId: p.userId,
        headline: p.headline,
        summary: p.summary,
        location: p.location,
        yearsExperience: p.yearsExperience,
        completionScore: p.completionScore,
        declaredSkills: p.declaredSkills,
        availability: p.availability,
      })),
      total,
      page,
      limit,
    };
  }

  async addToShortlist(
    recruiterId: string,
    companyId: string,
    userId: string,
    dto: ShortlistCandidateDto,
  ): Promise<{ message: string }> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const existing = await this.shortlistRepository.findOne({
      where: { companyId, userId },
    });

    if (existing) {
      throw new ConflictException('Candidate already in shortlist');
    }

    const shortlist = this.shortlistRepository.create({
      companyId,
      userId,
      notes: dto.notes,
      tags: dto.tags,
      addedBy: recruiterId,
    });

    await this.shortlistRepository.save(shortlist);

    return { message: 'Candidate added to shortlist' };
  }

  async getCompanyShortlist(
    recruiterId: string,
    companyId: string,
  ): Promise<any[]> {
    const shortlist = await this.shortlistRepository.find({
      where: { companyId },
      order: { addedAt: 'DESC' },
    });

    const userIds = shortlist.map((s) => s.userId);
    const profiles = await this.profileRepository.find({
      where: { userId: In(userIds) },
    });

    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    return shortlist.map((s) => {
      const profile = profileMap.get(s.userId);
      return {
        id: s.id,
        userId: s.userId,
        notes: s.notes,
        tags: s.tags,
        addedAt: s.addedAt,
        profile: profile
          ? {
              headline: profile.headline,
              location: profile.location,
              yearsExperience: profile.yearsExperience,
              completionScore: profile.completionScore,
            }
          : null,
      };
    });
  }

  async removeFromShortlist(
    recruiterId: string,
    companyId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.shortlistRepository.delete({ companyId, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Candidate not found in shortlist');
    }
  }

  private createProfileSnapshot(profile: ProfessionalProfileOrmEntity): Record<string, any> {
    return {
      headline: profile.headline,
      summary: profile.summary,
      location: profile.location,
      yearsExperience: profile.yearsExperience,
      linkedinUrl: profile.linkedinUrl,
      completionScore: profile.completionScore,
      declaredSkills: profile.declaredSkills,
    };
  }

  private mapApplicationToDto(
    app: ApplicationOrmEntity,
    job: JobOpportunityOrmEntity,
  ): ApplicationDto {
    return {
      id: app.id,
      userId: app.userId,
      jobOpportunityId: app.jobOpportunityId,
      jobTitle: job?.title || 'Unknown',
      companyName: (job as any)?.company?.legalName || 'Unknown',
      status: app.status,
      coverLetter: app.coverLetter,
      appliedAt: app.appliedAt,
      updatedAt: app.updatedAt,
      reviewedAt: app.reviewedAt,
    };
  }
}
