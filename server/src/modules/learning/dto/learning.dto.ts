import { PathDifficulty } from '../entities/learning-path.orm.entity';
import { ContentType } from '../entities/learning-content.orm.entity';
import { ProgressStatus } from '../entities/user-progress.orm.entity';
import { SkillCategory } from '../entities/skill.orm.entity';

export class SkillDto {
  id: string;
  name: string;
  description?: string;
  category: SkillCategory;
  iconUrl?: string;
}

export class LearningPathDto {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  difficulty: PathDifficulty;
  estimatedHours: number;
  moduleCount: number;
  skills: SkillDto[];
}

export class LearningModuleDto {
  id: string;
  pathId: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  estimatedMinutes: number;
  orderIndex: number;
  passingScore: number;
  contentCount: number;
  checkpointCount: number;
  skills: SkillDto[];
}

export class LearningModuleDetailDto extends LearningModuleDto {
  contents: LearningContentDto[];
  checkpoints: CheckpointDto[];
}

export class LearningContentDto {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  contentUrl: string;
  durationMinutes: number;
  orderIndex: number;
  isRequired: boolean;
}

export class CheckpointDto {
  id: string;
  title: string;
  question: string;
  options: { id: string; text: string }[];
  orderIndex: number;
  afterContentIndex?: number;
}

export class UserProgressDto {
  moduleId: string;
  moduleName: string;
  status: ProgressStatus;
  progressPercentage: number;
  completedContents: number;
  totalContents: number;
  completedCheckpoints: number;
  totalCheckpoints: number;
  evaluationScore?: number;
  evaluationPassed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export class ValidatedSkillDto {
  id: string;
  skillId: string;
  skillName: string;
  skillCategory: SkillCategory;
  moduleName: string;
  scoreAchieved: number;
  validatedAt: Date;
}

export class OverallProgressDto {
  totalPaths: number;
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  overallPercentage: number;
  validatedSkillsCount: number;
  moduleProgress: UserProgressDto[];
}
