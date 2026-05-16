import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningPathOrmEntity } from '../entities/learning-path.orm.entity';
import { LearningModuleOrmEntity } from '../entities/learning-module.orm.entity';
import { LearningContentOrmEntity } from '../entities/learning-content.orm.entity';
import { CheckpointOrmEntity } from '../entities/checkpoint.orm.entity';
import { ModuleEvaluationOrmEntity } from '../entities/module-evaluation.orm.entity';
import { UserProgressOrmEntity, ProgressStatus } from '../entities/user-progress.orm.entity';
import { ValidatedSkillOrmEntity } from '../entities/validated-skill.orm.entity';
import { SkillOrmEntity } from '../entities/skill.orm.entity';

@Injectable()
export class LearningRepository {
  constructor(
    @InjectRepository(LearningPathOrmEntity)
    private readonly pathRepository: Repository<LearningPathOrmEntity>,
    @InjectRepository(LearningModuleOrmEntity)
    private readonly moduleRepository: Repository<LearningModuleOrmEntity>,
    @InjectRepository(LearningContentOrmEntity)
    private readonly contentRepository: Repository<LearningContentOrmEntity>,
    @InjectRepository(CheckpointOrmEntity)
    private readonly checkpointRepository: Repository<CheckpointOrmEntity>,
    @InjectRepository(ModuleEvaluationOrmEntity)
    private readonly evaluationRepository: Repository<ModuleEvaluationOrmEntity>,
    @InjectRepository(UserProgressOrmEntity)
    private readonly progressRepository: Repository<UserProgressOrmEntity>,
    @InjectRepository(ValidatedSkillOrmEntity)
    private readonly validatedSkillRepository: Repository<ValidatedSkillOrmEntity>,
    @InjectRepository(SkillOrmEntity)
    private readonly skillRepository: Repository<SkillOrmEntity>,
  ) {}

  async findAllPaths(): Promise<LearningPathOrmEntity[]> {
    return this.pathRepository.find({
      where: { isActive: true },
      relations: ['modules', 'modules.skills'],
      order: { orderIndex: 'ASC' },
    });
  }

  async findPathById(id: string): Promise<LearningPathOrmEntity | null> {
    return this.pathRepository.findOne({
      where: { id },
      relations: ['modules', 'modules.skills', 'modules.contents', 'modules.checkpoints'],
    });
  }

  async findModuleById(id: string): Promise<LearningModuleOrmEntity | null> {
    return this.moduleRepository.findOne({
      where: { id },
      relations: ['skills', 'contents', 'checkpoints', 'evaluations'],
    });
  }

  async findModulesByPathId(pathId: string): Promise<LearningModuleOrmEntity[]> {
    return this.moduleRepository.find({
      where: { pathId, isActive: true },
      relations: ['skills'],
      order: { orderIndex: 'ASC' },
    });
  }

  async findContentsByModuleId(moduleId: string): Promise<LearningContentOrmEntity[]> {
    return this.contentRepository.find({
      where: { moduleId },
      order: { orderIndex: 'ASC' },
    });
  }

  async findCheckpointsByModuleId(moduleId: string): Promise<CheckpointOrmEntity[]> {
    return this.checkpointRepository.find({
      where: { moduleId },
      order: { orderIndex: 'ASC' },
    });
  }

  async findEvaluationsByModuleId(moduleId: string): Promise<ModuleEvaluationOrmEntity[]> {
    return this.evaluationRepository.find({
      where: { moduleId },
      order: { orderIndex: 'ASC' },
    });
  }

  async findUserProgress(userId: string, moduleId: string): Promise<UserProgressOrmEntity | null> {
    return this.progressRepository.findOne({
      where: { userId, moduleId },
      relations: ['module'],
    });
  }

  async findAllUserProgress(userId: string): Promise<UserProgressOrmEntity[]> {
    return this.progressRepository.find({
      where: { userId },
      relations: ['module'],
    });
  }

  async createOrUpdateProgress(
    userId: string,
    moduleId: string,
    data: Partial<UserProgressOrmEntity>,
  ): Promise<UserProgressOrmEntity> {
    let progress = await this.findUserProgress(userId, moduleId);

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        moduleId,
        status: ProgressStatus.IN_PROGRESS,
        ...data,
      });
    } else {
      Object.assign(progress, data);
    }

    return this.progressRepository.save(progress);
  }

  async findUserValidatedSkills(userId: string): Promise<ValidatedSkillOrmEntity[]> {
    return this.validatedSkillRepository.find({
      where: { userId },
      relations: ['skill', 'module'],
      order: { validatedAt: 'DESC' },
    });
  }

  async createValidatedSkill(
    data: Partial<ValidatedSkillOrmEntity>,
  ): Promise<ValidatedSkillOrmEntity> {
    const existing = await this.validatedSkillRepository.findOne({
      where: { userId: data.userId, skillId: data.skillId },
    });

    if (existing) {
      if (data.scoreAchieved && data.scoreAchieved > existing.scoreAchieved) {
        existing.scoreAchieved = data.scoreAchieved;
        existing.moduleId = data.moduleId!;
        return this.validatedSkillRepository.save(existing);
      }
      return existing;
    }

    const validatedSkill = this.validatedSkillRepository.create(data);
    return this.validatedSkillRepository.save(validatedSkill);
  }

  async findAllSkills(): Promise<SkillOrmEntity[]> {
    return this.skillRepository.find({
      where: { isActive: true },
    });
  }

  async countModules(): Promise<number> {
    return this.moduleRepository.count({ where: { isActive: true } });
  }

  async countPaths(): Promise<number> {
    return this.pathRepository.count({ where: { isActive: true } });
  }
}
