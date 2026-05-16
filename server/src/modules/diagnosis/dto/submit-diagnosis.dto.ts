import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DiagnosisAnswerDto {
  @IsUUID()
  questionId: string;

  @IsUUID()
  selectedOptionId: string;
}

export class SubmitDiagnosisDto {
  @IsUUID()
  testId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosisAnswerDto)
  answers: DiagnosisAnswerDto[];
}
