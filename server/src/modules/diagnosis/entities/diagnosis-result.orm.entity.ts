import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { DiagnosisTestOrmEntity } from './diagnosis-test.orm.entity';
import { DiagnosisResponseOrmEntity } from './diagnosis-response.orm.entity';

@Entity('diagnosis_results')
export class DiagnosisResultOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'test_id' })
  testId: string;

  @ManyToOne(() => DiagnosisTestOrmEntity)
  @JoinColumn({ name: 'test_id' })
  test: DiagnosisTestOrmEntity;

  @Column({ name: 'total_score', type: 'int' })
  totalScore: number;

  @Column({ name: 'max_possible_score', type: 'int' })
  maxPossibleScore: number;

  @Column({ name: 'percentage_score', type: 'float' })
  percentageScore: number;

  @Column({ name: 'skill_gaps', type: 'jsonb', nullable: true })
  skillGaps?: { category: string; currentLevel: number; requiredLevel: number }[];

  @Column({ name: 'recommended_paths', type: 'jsonb', nullable: true })
  recommendedPaths?: string[];

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @OneToMany(() => DiagnosisResponseOrmEntity, (response) => response.result)
  responses: DiagnosisResponseOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;
}
