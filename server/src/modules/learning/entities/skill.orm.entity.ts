import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { LearningModuleOrmEntity } from './learning-module.orm.entity';

export enum SkillCategory {
  DIGITAL = 'DIGITAL',
  COGNITIVE = 'COGNITIVE',
  SOCIOEMOTIONAL = 'SOCIOEMOTIONAL',
  TECHNICAL = 'TECHNICAL',
  LEADERSHIP = 'LEADERSHIP',
}

@Entity('skills')
export class SkillOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: SkillCategory,
  })
  category: SkillCategory;

  @Column({ name: 'icon_url', nullable: true })
  iconUrl?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToMany(() => LearningModuleOrmEntity, (module) => module.skills)
  modules: LearningModuleOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
