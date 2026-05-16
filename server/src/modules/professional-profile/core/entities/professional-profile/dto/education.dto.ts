import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { EducationLevel } from '../../../../persistence/postgres/entities/education.orm.entity';

export class EducationDto {
  id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  level: EducationLevel;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export class CreateEducationDto {
  @IsString()
  institutionName: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsEnum(EducationLevel)
  level?: EducationLevel;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateEducationDto {
  @IsOptional()
  @IsString()
  institutionName?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsEnum(EducationLevel)
  level?: EducationLevel;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
