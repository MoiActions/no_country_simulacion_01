import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LearningModuleOrmEntity } from './learning-module.orm.entity';

@Entity('checkpoints')
export class CheckpointOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module_id' })
  moduleId: string;

  @ManyToOne(() => LearningModuleOrmEntity, (module) => module.checkpoints)
  @JoinColumn({ name: 'module_id' })
  module: LearningModuleOrmEntity;

  @Column()
  title: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'jsonb' })
  options: { id: string; text: string; isCorrect: boolean }[];

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @Column({ name: 'after_content_index', type: 'int', nullable: true })
  afterContentIndex?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
