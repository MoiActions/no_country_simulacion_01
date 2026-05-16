import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum NotificationType {
  PROFILE_VIEWED = 'PROFILE_VIEWED',
  APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
  SHORTLISTED = 'SHORTLISTED',
  SKILL_VALIDATED = 'SKILL_VALIDATED',
  MODULE_COMPLETED = 'MODULE_COMPLETED',
  NEW_JOB_MATCH = 'NEW_JOB_MATCH',
  SYSTEM = 'SYSTEM',
}

@Entity('notifications')
@Index(['userId', 'read'])
export class NotificationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'action_url', nullable: true })
  actionUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt?: Date;
}
