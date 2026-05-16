import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WorkExperienceOrmEntity } from './work-experience.orm.entity';
import { EducationOrmEntity } from './education.orm.entity';

export enum ProfileVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  RECRUITERS_ONLY = 'RECRUITERS_ONLY',
}

@Entity('professional_profiles')
export class ProfessionalProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    unique: true,
  })
  userId!: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  headline?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  summary?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  pitch?: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  location?: string;

  @Column({
    name: 'years_experience',
    type: 'int',
    nullable: true,
  })
  yearsExperience?: number;

  @Column({
    name: 'linkedin_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  linkedinUrl?: string;

  @Column({
    name: 'portfolio_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  portfolioUrl?: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'enum',
    enum: ProfileVisibility,
    default: ProfileVisibility.PUBLIC,
  })
  visibility: ProfileVisibility;

  @Column({
    name: 'declared_skills',
    type: 'jsonb',
    default: [],
  })
  declaredSkills: string[];

  @Column({
    name: 'availability',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  availability?: string;

  @Column({
    name: 'preferred_work_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  preferredWorkType?: string;

  @Column({
    name: 'completion_score',
    type: 'float',
    default: 0,
  })
  completionScore!: number;

  @OneToMany(() => WorkExperienceOrmEntity, (exp) => exp.profile)
  workExperiences: WorkExperienceOrmEntity[];

  @OneToMany(() => EducationOrmEntity, (edu) => edu.profile)
  education: EducationOrmEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'last_updated',
    type: 'timestamptz',
  })
  lastUpdated!: Date;
}
