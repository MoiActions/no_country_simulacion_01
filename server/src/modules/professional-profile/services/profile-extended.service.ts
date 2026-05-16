import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalProfileOrmEntity } from '../persistence/postgres/entities/professional-profile.orm.entity';
import { WorkExperienceOrmEntity } from '../persistence/postgres/entities/work-experience.orm.entity';
import { EducationOrmEntity } from '../persistence/postgres/entities/education.orm.entity';
import {
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto,
  WorkExperienceDto,
} from '../core/entities/professional-profile/dto/work-experience.dto';
import {
  CreateEducationDto,
  UpdateEducationDto,
  EducationDto,
} from '../core/entities/professional-profile/dto/education.dto';

@Injectable()
export class ProfileExtendedService {
  constructor(
    @InjectRepository(ProfessionalProfileOrmEntity)
    private readonly profileRepository: Repository<ProfessionalProfileOrmEntity>,
    @InjectRepository(WorkExperienceOrmEntity)
    private readonly workExpRepository: Repository<WorkExperienceOrmEntity>,
    @InjectRepository(EducationOrmEntity)
    private readonly educationRepository: Repository<EducationOrmEntity>,
  ) {}

  async getFullProfile(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['workExperiences', 'education'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      ...profile,
      workExperiences: (profile.workExperiences || []).map((w) =>
        this.mapWorkExpToDto(w),
      ),
      education: (profile.education || []).map((e) => this.mapEducationToDto(e)),
    };
  }

  async getPublicProfile(profileId: string) {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['workExperiences', 'education'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      id: profile.id,
      headline: profile.headline,
      summary: profile.summary,
      pitch: profile.pitch,
      location: profile.location,
      yearsExperience: profile.yearsExperience,
      linkedinUrl: profile.linkedinUrl,
      portfolioUrl: profile.portfolioUrl,
      declaredSkills: profile.declaredSkills,
      availability: profile.availability,
      preferredWorkType: profile.preferredWorkType,
      workExperiences: (profile.workExperiences || []).map((w) =>
        this.mapWorkExpToDto(w),
      ),
      education: (profile.education || []).map((e) => this.mapEducationToDto(e)),
    };
  }

  async updatePitch(userId: string, pitch: string) {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    profile.pitch = pitch;
    await this.profileRepository.save(profile);
    return { pitch: profile.pitch };
  }

  async addWorkExperience(
    userId: string,
    dto: CreateWorkExperienceDto,
  ): Promise<WorkExperienceDto> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const workExp = this.workExpRepository.create({
      profileId: profile.id,
      companyName: dto.companyName,
      jobTitle: dto.jobTitle,
      description: dto.description,
      location: dto.location,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      isCurrent: dto.isCurrent || false,
      achievements: dto.achievements,
    });

    const saved = await this.workExpRepository.save(workExp);
    await this.updateCompletionScore(profile.id);
    return this.mapWorkExpToDto(saved);
  }

  async updateWorkExperience(
    userId: string,
    expId: string,
    dto: UpdateWorkExperienceDto,
  ): Promise<WorkExperienceDto> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const workExp = await this.workExpRepository.findOne({
      where: { id: expId, profileId: profile.id },
    });
    if (!workExp) {
      throw new NotFoundException('Work experience not found');
    }

    Object.assign(workExp, {
      companyName: dto.companyName ?? workExp.companyName,
      jobTitle: dto.jobTitle ?? workExp.jobTitle,
      description: dto.description ?? workExp.description,
      location: dto.location ?? workExp.location,
      startDate: dto.startDate ? new Date(dto.startDate) : workExp.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : workExp.endDate,
      isCurrent: dto.isCurrent ?? workExp.isCurrent,
      achievements: dto.achievements ?? workExp.achievements,
    });

    const saved = await this.workExpRepository.save(workExp);
    return this.mapWorkExpToDto(saved);
  }

  async deleteWorkExperience(userId: string, expId: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const result = await this.workExpRepository.delete({
      id: expId,
      profileId: profile.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Work experience not found');
    }

    await this.updateCompletionScore(profile.id);
  }

  async addEducation(userId: string, dto: CreateEducationDto): Promise<EducationDto> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const education = this.educationRepository.create({
      profileId: profile.id,
      institutionName: dto.institutionName,
      degree: dto.degree,
      fieldOfStudy: dto.fieldOfStudy,
      level: dto.level,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      isCurrent: dto.isCurrent || false,
      description: dto.description,
    });

    const saved = await this.educationRepository.save(education);
    await this.updateCompletionScore(profile.id);
    return this.mapEducationToDto(saved);
  }

  async updateEducation(
    userId: string,
    eduId: string,
    dto: UpdateEducationDto,
  ): Promise<EducationDto> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const education = await this.educationRepository.findOne({
      where: { id: eduId, profileId: profile.id },
    });
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    Object.assign(education, {
      institutionName: dto.institutionName ?? education.institutionName,
      degree: dto.degree ?? education.degree,
      fieldOfStudy: dto.fieldOfStudy ?? education.fieldOfStudy,
      level: dto.level ?? education.level,
      startDate: dto.startDate ? new Date(dto.startDate) : education.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : education.endDate,
      isCurrent: dto.isCurrent ?? education.isCurrent,
      description: dto.description ?? education.description,
    });

    const saved = await this.educationRepository.save(education);
    return this.mapEducationToDto(saved);
  }

  async deleteEducation(userId: string, eduId: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const result = await this.educationRepository.delete({
      id: eduId,
      profileId: profile.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Education not found');
    }

    await this.updateCompletionScore(profile.id);
  }

  private async updateCompletionScore(profileId: string): Promise<void> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['workExperiences', 'education'],
    });

    if (!profile) return;

    let score = 0;
    const maxScore = 100;

    if (profile.headline) score += 10;
    if (profile.summary) score += 15;
    if (profile.pitch) score += 15;
    if (profile.location) score += 5;
    if (profile.yearsExperience) score += 5;
    if (profile.linkedinUrl) score += 5;
    if (profile.portfolioUrl) score += 5;
    if (profile.workExperiences?.length > 0) score += 20;
    if (profile.education?.length > 0) score += 10;
    if (profile.declaredSkills?.length > 0) score += 10;

    profile.completionScore = Math.min(score, maxScore);
    await this.profileRepository.save(profile);
  }

  private mapWorkExpToDto(exp: WorkExperienceOrmEntity): WorkExperienceDto {
    return {
      id: exp.id,
      companyName: exp.companyName,
      jobTitle: exp.jobTitle,
      description: exp.description,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      achievements: exp.achievements,
    };
  }

  private mapEducationToDto(edu: EducationOrmEntity): EducationDto {
    return {
      id: edu.id,
      institutionName: edu.institutionName,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      level: edu.level,
      startDate: edu.startDate,
      endDate: edu.endDate,
      isCurrent: edu.isCurrent,
      description: edu.description,
    };
  }
}
