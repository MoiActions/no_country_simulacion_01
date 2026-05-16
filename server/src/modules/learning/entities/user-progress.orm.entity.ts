import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { LearningModuleOrmEntity } from './learning-module.orm.entity';

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('user_progress')
@Unique(['userId', 'moduleId'])
export class UserProgressOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'module_id' })
  moduleId: string;

  @ManyToOne(() => LearningModuleOrmEntity)
  @JoinColumn({ name: 'module_id' })
  module: LearningModuleOrmEntity;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
  })
  status: ProgressStatus;

  @Column({ name: 'completed_contents', type: 'jsonb', default: [] })
  completedContents: string[];

  @Column({ name: 'completed_checkpoints', type: 'jsonb', default: [] })
  completedCheckpoints: string[];

  @Column({ name: 'progress_percentage', type: 'float', default: 0 })
  progressPercentage: number;

  @Column({ name: 'evaluation_score', type: 'int', nullable: true })
  evaluationScore?: number;

  @Column({ name: 'evaluation_passed', default: false })
  evaluationPassed: boolean;

  @Column({ name: 'evaluation_attempts', type: 'int', default: 0 })
  evaluationAttempts: number;

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;
}
