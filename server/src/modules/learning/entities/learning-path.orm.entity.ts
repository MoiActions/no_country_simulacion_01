import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LearningModuleOrmEntity } from './learning-module.orm.entity';

export enum PathDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

@Entity('learning_paths')
export class LearningPathOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl?: string;

  @Column({
    type: 'enum',
    enum: PathDifficulty,
    default: PathDifficulty.BEGINNER,
  })
  difficulty: PathDifficulty;

  @Column({ name: 'estimated_hours', type: 'int', default: 0 })
  estimatedHours: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @OneToMany(() => LearningModuleOrmEntity, (module) => module.path)
  modules: LearningModuleOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
