import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { DiagnosisQuestionOrmEntity } from './diagnosis-question.orm.entity';
import { DiagnosisOptionOrmEntity } from './diagnosis-option.orm.entity';
import { DiagnosisResultOrmEntity } from './diagnosis-result.orm.entity';

@Entity('diagnosis_responses')
export class DiagnosisResponseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'result_id' })
  resultId: string;

  @ManyToOne(() => DiagnosisResultOrmEntity, (result) => result.responses)
  @JoinColumn({ name: 'result_id' })
  result: DiagnosisResultOrmEntity;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(() => DiagnosisQuestionOrmEntity)
  @JoinColumn({ name: 'question_id' })
  question: DiagnosisQuestionOrmEntity;

  @Column({ name: 'selected_option_id' })
  selectedOptionId: string;

  @ManyToOne(() => DiagnosisOptionOrmEntity)
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption: DiagnosisOptionOrmEntity;

  @Column({ type: 'int' })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
