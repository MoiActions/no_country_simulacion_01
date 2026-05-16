import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { SkillOrmEntity } from './skill.orm.entity';
import { LearningModuleOrmEntity } from './learning-module.orm.entity';

@Entity('validated_skills')
@Unique(['userId', 'skillId'])
export class ValidatedSkillOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'skill_id' })
  skillId: string;

  @ManyToOne(() => SkillOrmEntity)
  @JoinColumn({ name: 'skill_id' })
  skill: SkillOrmEntity;

  @Column({ name: 'module_id' })
  moduleId: string;

  @ManyToOne(() => LearningModuleOrmEntity)
  @JoinColumn({ name: 'module_id' })
  module: LearningModuleOrmEntity;

  @Column({ name: 'score_achieved', type: 'int' })
  scoreAchieved: number;

  @CreateDateColumn({ name: 'validated_at' })
  validatedAt: Date;
}
