import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LearningModuleOrmEntity } from './learning-module.orm.entity';

@Entity('module_evaluations')
export class ModuleEvaluationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module_id' })
  moduleId: string;

  @ManyToOne(() => LearningModuleOrmEntity, (module) => module.evaluations)
  @JoinColumn({ name: 'module_id' })
  module: LearningModuleOrmEntity;

  @Column()
  question: string;

  @Column({ type: 'jsonb' })
  options: { id: string; text: string; isCorrect: boolean }[];

  @Column({ type: 'int', default: 1 })
  points: number;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
