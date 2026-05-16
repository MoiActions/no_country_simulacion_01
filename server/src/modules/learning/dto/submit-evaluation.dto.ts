import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EvaluationAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  selectedOptionId: string;
}

export class SubmitEvaluationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluationAnswerDto)
  answers: EvaluationAnswerDto[];
}

export class CompleteContentDto {
  @IsUUID()
  contentId: string;
}

export class CompleteCheckpointDto {
  @IsString()
  selectedOptionId: string;
}
