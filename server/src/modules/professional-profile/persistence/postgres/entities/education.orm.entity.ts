import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfessionalProfileOrmEntity } from './professional-profile.orm.entity';

export enum EducationLevel {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  TECHNICAL = 'TECHNICAL',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTORATE = 'DOCTORATE',
  CERTIFICATION = 'CERTIFICATION',
  OTHER = 'OTHER',
}

@Entity('education')
export class EducationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'profile_id' })
  profileId: string;

  @ManyToOne(() => ProfessionalProfileOrmEntity, (profile) => profile.education)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfessionalProfileOrmEntity;

  @Column({ name: 'institution_name' })
  institutionName: string;

  @Column()
  degree: string;

  @Column({ name: 'field_of_study', nullable: true })
  fieldOfStudy?: string;

  @Column({
    type: 'enum',
    enum: EducationLevel,
    default: EducationLevel.OTHER,
  })
  level: EducationLevel;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({ name: 'is_current', default: false })
  isCurrent: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
