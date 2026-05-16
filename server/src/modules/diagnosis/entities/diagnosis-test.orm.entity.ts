import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { DiagnosisQuestionOrmEntity } from './diagnosis-question.orm.entity';

export enum DiagnosisTestType {
  DIGITAL = 'DIGITAL',
  COGNITIVE = 'COGNITIVE',
  SOCIOEMOTIONAL = 'SOCIOEMOTIONAL',
}

@Entity('diagnosis_tests')
export class DiagnosisTestOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: DiagnosisTestType,
  })
  type: DiagnosisTestType;

  @Column({ name: 'estimated_minutes', default: 10 })
  estimatedMinutes: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @OneToMany(() => DiagnosisQuestionOrmEntity, (question) => question.test)
  questions: DiagnosisQuestionOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
