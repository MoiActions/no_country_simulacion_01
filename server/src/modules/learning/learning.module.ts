import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningController } from './controllers/learning.controller';
import { LearningService } from './services/learning.service';
import { LearningRepository } from './repositories/learning.repository';
import { SkillOrmEntity } from './entities/skill.orm.entity';
import { LearningPathOrmEntity } from './entities/learning-path.orm.entity';
import { LearningModuleOrmEntity } from './entities/learning-module.orm.entity';
import { LearningContentOrmEntity } from './entities/learning-content.orm.entity';
import { CheckpointOrmEntity } from './entities/checkpoint.orm.entity';
import { ModuleEvaluationOrmEntity } from './entities/module-evaluation.orm.entity';
import { UserProgressOrmEntity } from './entities/user-progress.orm.entity';
import { ValidatedSkillOrmEntity } from './entities/validated-skill.orm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SkillOrmEntity,
      LearningPathOrmEntity,
      LearningModuleOrmEntity,
      LearningContentOrmEntity,
      CheckpointOrmEntity,
      ModuleEvaluationOrmEntity,
      UserProgressOrmEntity,
      ValidatedSkillOrmEntity,
    ]),
  ],
  controllers: [LearningController],
  providers: [LearningService, LearningRepository],
  exports: [LearningService],
})
export class LearningModule {}
