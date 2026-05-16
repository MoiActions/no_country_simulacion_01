import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LearningModuleOrmEntity } from './learning-module.orm.entity';

export enum ContentType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  ARTICLE = 'ARTICLE',
  INTERACTIVE = 'INTERACTIVE',
  QUIZ = 'QUIZ',
}

@Entity('learning_contents')
export class LearningContentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module_id' })
  moduleId: string;

  @ManyToOne(() => LearningModuleOrmEntity, (module) => module.contents)
  @JoinColumn({ name: 'module_id' })
  module: LearningModuleOrmEntity;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  type: ContentType;

  @Column({ name: 'content_url' })
  contentUrl: string;

  @Column({ name: 'duration_minutes', type: 'int', default: 0 })
  durationMinutes: number;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @Column({ name: 'is_required', default: true })
  isRequired: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
