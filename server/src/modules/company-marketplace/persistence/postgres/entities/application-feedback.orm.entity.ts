import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApplicationOrmEntity } from './application.orm.entity';

export enum FeedbackType {
  POSITIVE = 'POSITIVE',
  CONSTRUCTIVE = 'CONSTRUCTIVE',
  REJECTION = 'REJECTION',
}

@Entity('application_feedback')
export class ApplicationFeedbackOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id' })
  applicationId: string;

  @ManyToOne(() => ApplicationOrmEntity)
  @JoinColumn({ name: 'application_id' })
  application: ApplicationOrmEntity;

  @Column({ name: 'recruiter_id' })
  recruiterId: string;

  @Column({
    type: 'enum',
    enum: FeedbackType,
  })
  type: FeedbackType;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'skills_to_improve', type: 'jsonb', nullable: true })
  skillsToImprove?: string[];

  @Column({ name: 'is_visible_to_candidate', default: true })
  isVisibleToCandidate: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
