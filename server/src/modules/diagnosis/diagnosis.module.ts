import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosisController } from './controllers/diagnosis.controller';
import { DiagnosisService } from './services/diagnosis.service';
import { DiagnosisRepository } from './repositories/diagnosis.repository';
import { DiagnosisTestOrmEntity } from './entities/diagnosis-test.orm.entity';
import { DiagnosisQuestionOrmEntity } from './entities/diagnosis-question.orm.entity';
import { DiagnosisOptionOrmEntity } from './entities/diagnosis-option.orm.entity';
import { DiagnosisResultOrmEntity } from './entities/diagnosis-result.orm.entity';
import { DiagnosisResponseOrmEntity } from './entities/diagnosis-response.orm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiagnosisTestOrmEntity,
      DiagnosisQuestionOrmEntity,
      DiagnosisOptionOrmEntity,
      DiagnosisResultOrmEntity,
      DiagnosisResponseOrmEntity,
    ]),
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService, DiagnosisRepository],
  exports: [DiagnosisService],
})
export class DiagnosisModule {}
