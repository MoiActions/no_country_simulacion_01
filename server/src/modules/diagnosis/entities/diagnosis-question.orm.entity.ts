import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DiagnosisTestOrmEntity } from './diagnosis-test.orm.entity';
import { DiagnosisOptionOrmEntity } from './diagnosis-option.orm.entity';

@Entity('diagnosis_questions')
export class DiagnosisQuestionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'test_id' })
  testId: string;

  @ManyToOne(() => DiagnosisTestOrmEntity, (test) => test.questions)
  @JoinColumn({ name: 'test_id' })
  test: DiagnosisTestOrmEntity;

  @Column({ type: 'text' })
  question: string;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @Column({ name: 'skill_category', nullable: true })
  skillCategory?: string;

  @OneToMany(() => DiagnosisOptionOrmEntity, (option) => option.question)
  options: DiagnosisOptionOrmEntity[];
}
