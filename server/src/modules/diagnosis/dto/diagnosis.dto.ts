import { DiagnosisTestType } from '../entities/diagnosis-test.orm.entity';

export class DiagnosisTestDto {
  id: string;
  name: string;
  description?: string;
  type: DiagnosisTestType;
  estimatedMinutes: number;
  questionCount?: number;
}

export class DiagnosisQuestionDto {
  id: string;
  question: string;
  orderIndex: number;
  skillCategory?: string;
  options: DiagnosisOptionDto[];
}

export class DiagnosisOptionDto {
  id: string;
  text: string;
  orderIndex: number;
}

export class DiagnosisResultDto {
  id: string;
  testId: string;
  testName: string;
  testType: DiagnosisTestType;
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  skillGaps: { category: string; currentLevel: number; requiredLevel: number }[];
  recommendedPaths: string[];
  isCompleted: boolean;
  completedAt?: Date;
}

export class SkillGapDto {
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gapPercentage: number;
}
