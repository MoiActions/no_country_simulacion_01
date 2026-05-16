import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { CompanyOrmEntity } from './company.orm.entity';

@Entity('candidate_shortlists')
@Unique(['companyId', 'userId'])
export class CandidateShortlistOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => CompanyOrmEntity)
  @JoinColumn({ name: 'company_id' })
  company: CompanyOrmEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ name: 'added_by' })
  addedBy: string;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;
}
