import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosisTestOrmEntity } from '../entities/diagnosis-test.orm.entity';
import { DiagnosisQuestionOrmEntity } from '../entities/diagnosis-question.orm.entity';
import { DiagnosisOptionOrmEntity } from '../entities/diagnosis-option.orm.entity';
import { DiagnosisResultOrmEntity } from '../entities/diagnosis-result.orm.entity';
import { DiagnosisResponseOrmEntity } from '../entities/diagnosis-response.orm.entity';

@Injectable()
export class DiagnosisRepository {
  constructor(
    @InjectRepository(DiagnosisTestOrmEntity)
    private readonly testRepository: Repository<DiagnosisTestOrmEntity>,
    @InjectRepository(DiagnosisQuestionOrmEntity)
    private readonly questionRepository: Repository<DiagnosisQuestionOrmEntity>,
    @InjectRepository(DiagnosisOptionOrmEntity)
    private readonly optionRepository: Repository<DiagnosisOptionOrmEntity>,
    @InjectRepository(DiagnosisResultOrmEntity)
    private readonly resultRepository: Repository<DiagnosisResultOrmEntity>,
    @InjectRepository(DiagnosisResponseOrmEntity)
    private readonly responseRepository: Repository<DiagnosisResponseOrmEntity>,
  ) {}

  async findAllActiveTests(): Promise<DiagnosisTestOrmEntity[]> {
    return this.testRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC' },
      relations: ['questions'],
    });
  }

  async findTestById(id: string): Promise<DiagnosisTestOrmEntity | null> {
    return this.testRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });
  }

  async findQuestionsByTestId(testId: string): Promise<DiagnosisQuestionOrmEntity[]> {
    return this.questionRepository.find({
      where: { testId },
      relations: ['options'],
      order: { orderIndex: 'ASC' },
    });
  }

  async findOptionById(id: string): Promise<DiagnosisOptionOrmEntity | null> {
    return this.optionRepository.findOne({ where: { id } });
  }

  async findUserResults(userId: string): Promise<DiagnosisResultOrmEntity[]> {
    return this.resultRepository.find({
      where: { userId },
      relations: ['test'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserResultForTest(
    userId: string,
    testId: string,
  ): Promise<DiagnosisResultOrmEntity | null> {
    return this.resultRepository.findOne({
      where: { userId, testId },
      relations: ['test', 'responses'],
      order: { createdAt: 'DESC' },
    });
  }

  async createResult(
    data: Partial<DiagnosisResultOrmEntity>,
  ): Promise<DiagnosisResultOrmEntity> {
    const result = this.resultRepository.create(data);
    return this.resultRepository.save(result);
  }

  async updateResult(
    id: string,
    data: Partial<DiagnosisResultOrmEntity>,
  ): Promise<DiagnosisResultOrmEntity | null> {
    await this.resultRepository.update(id, data);
    return this.resultRepository.findOne({ where: { id }, relations: ['test'] });
  }

  async createResponse(
    data: Partial<DiagnosisResponseOrmEntity>,
  ): Promise<DiagnosisResponseOrmEntity> {
    const response = this.responseRepository.create(data);
    return this.responseRepository.save(response);
  }

  async createResponses(
    responses: Partial<DiagnosisResponseOrmEntity>[],
  ): Promise<DiagnosisResponseOrmEntity[]> {
    const entities = this.responseRepository.create(responses);
    return this.responseRepository.save(entities);
  }

  async getMaxScoreForTest(testId: string): Promise<number> {
    const questions = await this.questionRepository.find({
      where: { testId },
      relations: ['options'],
    });

    return questions.reduce((total, question) => {
      const maxOptionScore = Math.max(...question.options.map((o) => o.score), 0);
      return total + maxOptionScore;
    }, 0);
  }
}
