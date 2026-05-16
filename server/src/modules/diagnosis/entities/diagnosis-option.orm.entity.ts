import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DiagnosisQuestionOrmEntity } from './diagnosis-question.orm.entity';

@Entity('diagnosis_options')
export class DiagnosisOptionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(() => DiagnosisQuestionOrmEntity, (question) => question.options)
  @JoinColumn({ name: 'question_id' })
  question: DiagnosisQuestionOrmEntity;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;
}
