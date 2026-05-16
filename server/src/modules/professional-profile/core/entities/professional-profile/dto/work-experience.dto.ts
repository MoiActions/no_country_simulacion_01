import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
} from 'class-validator';

export class WorkExperienceDto {
  id: string;
  companyName: string;
  jobTitle: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  achievements?: string[];
}

export class CreateWorkExperienceDto {
  @IsString()
  companyName: string;

  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];
}

export class UpdateWorkExperienceDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

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
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];
}
