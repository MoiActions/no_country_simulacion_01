import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LearningRepository } from '../repositories/learning.repository';
import {
  LearningPathDto,
  LearningModuleDto,
  LearningModuleDetailDto,
  LearningContentDto,
  CheckpointDto,
  UserProgressDto,
  ValidatedSkillDto,
  OverallProgressDto,
  SkillDto,
} from '../dto/learning.dto';
import { SubmitEvaluationDto } from '../dto/submit-evaluation.dto';
import { ProgressStatus } from '../entities/user-progress.orm.entity';
import { LearningPathOrmEntity } from '../entities/learning-path.orm.entity';
import { LearningModuleOrmEntity } from '../entities/learning-module.orm.entity';

@Injectable()
export class LearningService {
  constructor(private readonly learningRepository: LearningRepository) {}

  async getAllPaths(): Promise<LearningPathDto[]> {
    const paths = await this.learningRepository.findAllPaths();
    return paths.map((p) => this.mapPathToDto(p));
  }

  async getPathById(id: string): Promise<LearningPathDto> {
    const path = await this.learningRepository.findPathById(id);
    if (!path) {
      throw new NotFoundException(`Learning path with ID ${id} not found`);
    }
    return this.mapPathToDto(path);
  }

  async getModuleById(id: string): Promise<LearningModuleDetailDto> {
    const module = await this.learningRepository.findModuleById(id);
    if (!module) {
      throw new NotFoundException(`Learning module with ID ${id} not found`);
    }
    return this.mapModuleToDetailDto(module);
  }

  async completeContent(
    userId: string,
    moduleId: string,
    contentId: string,
  ): Promise<UserProgressDto> {
    const module = await this.learningRepository.findModuleById(moduleId);
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    const content = module.contents.find((c) => c.id === contentId);
    if (!content) {
      throw new BadRequestException(`Content with ID ${contentId} not found in this module`);
    }

    let progress = await this.learningRepository.findUserProgress(userId, moduleId);
    const completedContents = progress?.completedContents || [];

    if (!completedContents.includes(contentId)) {
      completedContents.push(contentId);
    }

    const totalContents = module.contents.length;
    const totalCheckpoints = module.checkpoints.length;
    const completedCheckpoints = progress?.completedCheckpoints || [];

    const progressPercentage = this.calculateProgress(
      completedContents.length,
      totalContents,
      completedCheckpoints.length,
      totalCheckpoints,
    );

    progress = await this.learningRepository.createOrUpdateProgress(userId, moduleId, {
      completedContents,
      progressPercentage,
      status:
        progressPercentage === 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
    });

    return this.mapProgressToDto(progress, module);
  }

  async completeCheckpoint(
    userId: string,
    moduleId: string,
    checkpointId: string,
    selectedOptionId: string,
  ): Promise<{ correct: boolean; progress: UserProgressDto }> {
    const module = await this.learningRepository.findModuleById(moduleId);
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    const checkpoint = module.checkpoints.find((c) => c.id === checkpointId);
    if (!checkpoint) {
      throw new BadRequestException(`Checkpoint with ID ${checkpointId} not found`);
    }

    const selectedOption = checkpoint.options.find((o) => o.id === selectedOptionId);
    if (!selectedOption) {
      throw new BadRequestException('Invalid option selected');
    }

    let progress = await this.learningRepository.findUserProgress(userId, moduleId);
    const completedCheckpoints = progress?.completedCheckpoints || [];

    if (!completedCheckpoints.includes(checkpointId)) {
      completedCheckpoints.push(checkpointId);
    }

    const completedContents = progress?.completedContents || [];
    const progressPercentage = this.calculateProgress(
      completedContents.length,
      module.contents.length,
      completedCheckpoints.length,
      module.checkpoints.length,
    );

    progress = await this.learningRepository.createOrUpdateProgress(userId, moduleId, {
      completedCheckpoints,
      progressPercentage,
      status:
        progressPercentage === 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
    });

    return {
      correct: selectedOption.isCorrect,
      progress: this.mapProgressToDto(progress, module),
    };
  }

  async submitEvaluation(
    userId: string,
    moduleId: string,
    submitDto: SubmitEvaluationDto,
  ): Promise<{
    passed: boolean;
    score: number;
    passingScore: number;
    validatedSkills: ValidatedSkillDto[];
  }> {
    const module = await this.learningRepository.findModuleById(moduleId);
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    const evaluations = await this.learningRepository.findEvaluationsByModuleId(moduleId);
    if (evaluations.length === 0) {
      throw new BadRequestException('No evaluation questions found for this module');
    }

    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const evaluation of evaluations) {
      totalPoints += evaluation.points;
      const answer = submitDto.answers.find((a) => a.questionId === evaluation.id);

      if (answer) {
        const correctOption = evaluation.options.find((o) => o.isCorrect);
        if (correctOption && answer.selectedOptionId === correctOption.id) {
          correctAnswers++;
          earnedPoints += evaluation.points;
        }
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= module.passingScore;

    let progress = await this.learningRepository.findUserProgress(userId, moduleId);
    const attempts = (progress?.evaluationAttempts || 0) + 1;

    progress = await this.learningRepository.createOrUpdateProgress(userId, moduleId, {
      evaluationScore: score,
      evaluationPassed: passed,
      evaluationAttempts: attempts,
      status: passed ? ProgressStatus.COMPLETED : progress?.status,
      completedAt: passed ? new Date() : undefined,
    });

    const validatedSkills: ValidatedSkillDto[] = [];

    if (passed && module.skills.length > 0) {
      for (const skill of module.skills) {
        const validatedSkill = await this.learningRepository.createValidatedSkill({
          userId,
          skillId: skill.id,
          moduleId,
          scoreAchieved: score,
        });

        validatedSkills.push({
          id: validatedSkill.id,
          skillId: skill.id,
          skillName: skill.name,
          skillCategory: skill.category,
          moduleName: module.name,
          scoreAchieved: score,
          validatedAt: validatedSkill.validatedAt,
        });
      }
    }

    return {
      passed,
      score,
      passingScore: module.passingScore,
      validatedSkills,
    };
  }

  async getUserProgress(userId: string): Promise<OverallProgressDto> {
    const allProgress = await this.learningRepository.findAllUserProgress(userId);
    const totalPaths = await this.learningRepository.countPaths();
    const totalModules = await this.learningRepository.countModules();
    const validatedSkills = await this.learningRepository.findUserValidatedSkills(userId);

    const completedModules = allProgress.filter(
      (p) => p.status === ProgressStatus.COMPLETED,
    ).length;
    const inProgressModules = allProgress.filter(
      (p) => p.status === ProgressStatus.IN_PROGRESS,
    ).length;

    const overallPercentage =
      totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    return {
      totalPaths,
      totalModules,
      completedModules,
      inProgressModules,
      overallPercentage,
      validatedSkillsCount: validatedSkills.length,
      moduleProgress: allProgress.map((p) => this.mapProgressToDto(p, p.module)),
    };
  }

  async getValidatedSkills(userId: string): Promise<ValidatedSkillDto[]> {
    const skills = await this.learningRepository.findUserValidatedSkills(userId);
    return skills.map((s) => ({
      id: s.id,
      skillId: s.skill.id,
      skillName: s.skill.name,
      skillCategory: s.skill.category,
      moduleName: s.module.name,
      scoreAchieved: s.scoreAchieved,
      validatedAt: s.validatedAt,
    }));
  }

  private calculateProgress(
    completedContents: number,
    totalContents: number,
    completedCheckpoints: number,
    totalCheckpoints: number,
  ): number {
    const totalItems = totalContents + totalCheckpoints;
    if (totalItems === 0) return 0;

    const completedItems = completedContents + completedCheckpoints;
    return Math.round((completedItems / totalItems) * 100);
  }

  private mapPathToDto(path: LearningPathOrmEntity): LearningPathDto {
    const allSkills: SkillDto[] = [];
    const skillIds = new Set<string>();

    for (const module of path.modules || []) {
      for (const skill of module.skills || []) {
        if (!skillIds.has(skill.id)) {
          skillIds.add(skill.id);
          allSkills.push({
            id: skill.id,
            name: skill.name,
            description: skill.description,
            category: skill.category,
            iconUrl: skill.iconUrl,
          });
        }
      }
    }

    return {
      id: path.id,
      name: path.name,
      description: path.description,
      thumbnailUrl: path.thumbnailUrl,
      difficulty: path.difficulty,
      estimatedHours: path.estimatedHours,
      moduleCount: path.modules?.length || 0,
      skills: allSkills,
    };
  }

  private mapModuleToDto(module: LearningModuleOrmEntity): LearningModuleDto {
    return {
      id: module.id,
      pathId: module.pathId,
      name: module.name,
      description: module.description,
      thumbnailUrl: module.thumbnailUrl,
      estimatedMinutes: module.estimatedMinutes,
      orderIndex: module.orderIndex,
      passingScore: module.passingScore,
      contentCount: module.contents?.length || 0,
      checkpointCount: module.checkpoints?.length || 0,
      skills: (module.skills || []).map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        category: s.category,
        iconUrl: s.iconUrl,
      })),
    };
  }

  private mapModuleToDetailDto(module: LearningModuleOrmEntity): LearningModuleDetailDto {
    return {
      ...this.mapModuleToDto(module),
      contents: (module.contents || [])
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(
          (c): LearningContentDto => ({
            id: c.id,
            title: c.title,
            description: c.description,
            type: c.type,
            contentUrl: c.contentUrl,
            durationMinutes: c.durationMinutes,
            orderIndex: c.orderIndex,
            isRequired: c.isRequired,
          }),
        ),
      checkpoints: (module.checkpoints || [])
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(
          (c): CheckpointDto => ({
            id: c.id,
            title: c.title,
            question: c.question,
            options: c.options.map((o) => ({ id: o.id, text: o.text })),
            orderIndex: c.orderIndex,
            afterContentIndex: c.afterContentIndex,
          }),
        ),
    };
  }

  private mapProgressToDto(
    progress: any,
    module: LearningModuleOrmEntity,
  ): UserProgressDto {
    return {
      moduleId: progress.moduleId,
      moduleName: module.name,
      status: progress.status,
      progressPercentage: progress.progressPercentage,
      completedContents: progress.completedContents?.length || 0,
      totalContents: module.contents?.length || 0,
      completedCheckpoints: progress.completedCheckpoints?.length || 0,
      totalCheckpoints: module.checkpoints?.length || 0,
      evaluationScore: progress.evaluationScore,
      evaluationPassed: progress.evaluationPassed,
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
    };
  }
}
