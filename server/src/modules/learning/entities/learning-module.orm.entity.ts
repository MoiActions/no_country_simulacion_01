import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { LearningPathOrmEntity } from './learning-path.orm.entity';
import { LearningContentOrmEntity } from './learning-content.orm.entity';
import { CheckpointOrmEntity } from './checkpoint.orm.entity';
import { ModuleEvaluationOrmEntity } from './module-evaluation.orm.entity';
import { SkillOrmEntity } from './skill.orm.entity';

@Entity('learning_modules')
export class LearningModuleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'path_id' })
  pathId: string;

  @ManyToOne(() => LearningPathOrmEntity, (path) => path.modules)
  @JoinColumn({ name: 'path_id' })
  path: LearningPathOrmEntity;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl?: string;

  @Column({ name: 'estimated_minutes', type: 'int', default: 30 })
  estimatedMinutes: number;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'passing_score', type: 'int', default: 70 })
  passingScore: number;

  @OneToMany(() => LearningContentOrmEntity, (content) => content.module)
  contents: LearningContentOrmEntity[];

  @OneToMany(() => CheckpointOrmEntity, (checkpoint) => checkpoint.module)
  checkpoints: CheckpointOrmEntity[];

  @OneToMany(() => ModuleEvaluationOrmEntity, (evaluation) => evaluation.module)
  evaluations: ModuleEvaluationOrmEntity[];

  @ManyToMany(() => SkillOrmEntity, (skill) => skill.modules)
  @JoinTable({
    name: 'module_skills',
    joinColumn: { name: 'module_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: SkillOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
