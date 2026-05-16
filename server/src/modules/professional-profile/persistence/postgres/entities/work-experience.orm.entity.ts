import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfessionalProfileOrmEntity } from './professional-profile.orm.entity';

@Entity('work_experiences')
export class WorkExperienceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'profile_id' })
  profileId: string;

  @ManyToOne(() => ProfessionalProfileOrmEntity, (profile) => profile.workExperiences)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfessionalProfileOrmEntity;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'job_title' })
  jobTitle: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({ name: 'is_current', default: false })
  isCurrent: boolean;

  @Column({ type: 'jsonb', nullable: true })
  achievements?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
