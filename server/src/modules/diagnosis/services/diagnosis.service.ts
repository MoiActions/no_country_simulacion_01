import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DiagnosisRepository } from '../repositories/diagnosis.repository';
import {
  DiagnosisTestDto,
  DiagnosisQuestionDto,
  DiagnosisOptionDto,
  DiagnosisResultDto,
} from '../dto/diagnosis.dto';
import { SubmitDiagnosisDto } from '../dto/submit-diagnosis.dto';
import { DiagnosisTestOrmEntity } from '../entities/diagnosis-test.orm.entity';
import { DiagnosisQuestionOrmEntity } from '../entities/diagnosis-question.orm.entity';

@Injectable()
export class DiagnosisService {
  constructor(private readonly diagnosisRepository: DiagnosisRepository) {}

  async getAvailableTests(): Promise<DiagnosisTestDto[]> {
    const tests = await this.diagnosisRepository.findAllActiveTests();
    return tests.map((test) => this.mapTestToDto(test));
  }

  async getTestQuestions(testId: string): Promise<DiagnosisQuestionDto[]> {
    const test = await this.diagnosisRepository.findTestById(testId);
    if (!test) {
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }

    const questions = await this.diagnosisRepository.findQuestionsByTestId(testId);
    return questions.map((q) => this.mapQuestionToDto(q));
  }

  async submitDiagnosis(
    userId: string,
    submitDto: SubmitDiagnosisDto,
  ): Promise<DiagnosisResultDto> {
    const test = await this.diagnosisRepository.findTestById(submitDto.testId);
    if (!test) {
      throw new NotFoundException(`Test with ID ${submitDto.testId} not found`);
    }

    const questions = await this.diagnosisRepository.findQuestionsByTestId(
      submitDto.testId,
    );
    if (submitDto.answers.length !== questions.length) {
      throw new BadRequestException(
        `Expected ${questions.length} answers, received ${submitDto.answers.length}`,
      );
    }

    let totalScore = 0;
    const skillScores: Record<string, { score: number; maxScore: number }> = {};

    for (const answer of submitDto.answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) {
        throw new BadRequestException(
          `Question with ID ${answer.questionId} not found in this test`,
        );
      }

      const option = question.options.find((o) => o.id === answer.selectedOptionId);
      if (!option) {
        throw new BadRequestException(
          `Option with ID ${answer.selectedOptionId} not found for question ${answer.questionId}`,
        );
      }

      totalScore += option.score;

      if (question.skillCategory) {
        if (!skillScores[question.skillCategory]) {
          skillScores[question.skillCategory] = { score: 0, maxScore: 0 };
        }
        skillScores[question.skillCategory].score += option.score;
        const maxOptionScore = Math.max(...question.options.map((o) => o.score));
        skillScores[question.skillCategory].maxScore += maxOptionScore;
      }
    }

    const maxPossibleScore =
      await this.diagnosisRepository.getMaxScoreForTest(submitDto.testId);
    const percentageScore =
      maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    const skillGaps = Object.entries(skillScores).map(([category, scores]) => ({
      category,
      currentLevel: Math.round((scores.score / scores.maxScore) * 100),
      requiredLevel: 80,
    }));

    const recommendedPaths = this.generateRecommendedPaths(skillGaps, test.type);

    const result = await this.diagnosisRepository.createResult({
      userId,
      testId: submitDto.testId,
      totalScore,
      maxPossibleScore,
      percentageScore,
      skillGaps,
      recommendedPaths,
      isCompleted: true,
      completedAt: new Date(),
    });

    const responses = submitDto.answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId)!;
      const option = question.options.find((o) => o.id === answer.selectedOptionId)!;
      return {
        resultId: result.id,
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        score: option.score,
      };
    });

    await this.diagnosisRepository.createResponses(responses);

    return this.mapResultToDto(result, test);
  }

  async getUserResults(userId: string): Promise<DiagnosisResultDto[]> {
    const results = await this.diagnosisRepository.findUserResults(userId);
    return results.map((r) => this.mapResultToDto(r, r.test));
  }

  async getRecommendedPath(userId: string): Promise<{
    overallScore: number;
    skillGaps: { category: string; currentLevel: number; requiredLevel: number }[];
    recommendedPaths: string[];
  }> {
    const results = await this.diagnosisRepository.findUserResults(userId);

    if (results.length === 0) {
      return {
        overallScore: 0,
        skillGaps: [],
        recommendedPaths: ['Complete the diagnostic tests to get personalized recommendations'],
      };
    }

    const completedResults = results.filter((r) => r.isCompleted);
    const overallScore =
      completedResults.reduce((sum, r) => sum + r.percentageScore, 0) /
      (completedResults.length || 1);

    const allSkillGaps = completedResults.flatMap((r) => r.skillGaps || []);
    const aggregatedGaps: Record<
      string,
      { totalCurrent: number; count: number; requiredLevel: number }
    > = {};

    for (const gap of allSkillGaps) {
      if (!aggregatedGaps[gap.category]) {
        aggregatedGaps[gap.category] = {
          totalCurrent: 0,
          count: 0,
          requiredLevel: gap.requiredLevel,
        };
      }
      aggregatedGaps[gap.category].totalCurrent += gap.currentLevel;
      aggregatedGaps[gap.category].count += 1;
    }

    const skillGaps = Object.entries(aggregatedGaps).map(([category, data]) => ({
      category,
      currentLevel: Math.round(data.totalCurrent / data.count),
      requiredLevel: data.requiredLevel,
    }));

    const recommendedPaths = [
      ...new Set(completedResults.flatMap((r) => r.recommendedPaths || [])),
    ];

    return {
      overallScore: Math.round(overallScore),
      skillGaps,
      recommendedPaths,
    };
  }

  private generateRecommendedPaths(
    skillGaps: { category: string; currentLevel: number; requiredLevel: number }[],
    testType: string,
  ): string[] {
    const recommendations: string[] = [];

    for (const gap of skillGaps) {
      if (gap.currentLevel < gap.requiredLevel) {
        const gapSize = gap.requiredLevel - gap.currentLevel;
        if (gapSize > 30) {
          recommendations.push(`Fundamentals of ${gap.category}`);
        } else if (gapSize > 15) {
          recommendations.push(`Intermediate ${gap.category}`);
        } else {
          recommendations.push(`Advanced ${gap.category}`);
        }
      }
    }

    if (recommendations.length === 0) {
      recommendations.push(`Advanced ${testType} Skills`);
    }

    return recommendations;
  }

  private mapTestToDto(test: DiagnosisTestOrmEntity): DiagnosisTestDto {
    return {
      id: test.id,
      name: test.name,
      description: test.description,
      type: test.type,
      estimatedMinutes: test.estimatedMinutes,
      questionCount: test.questions?.length || 0,
    };
  }

  private mapQuestionToDto(question: DiagnosisQuestionOrmEntity): DiagnosisQuestionDto {
    return {
      id: question.id,
      question: question.question,
      orderIndex: question.orderIndex,
      skillCategory: question.skillCategory,
      options: question.options
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(
          (o): DiagnosisOptionDto => ({
            id: o.id,
            text: o.text,
            orderIndex: o.orderIndex,
          }),
        ),
    };
  }

  private mapResultToDto(
    result: any,
    test: DiagnosisTestOrmEntity,
  ): DiagnosisResultDto {
    return {
      id: result.id,
      testId: result.testId,
      testName: test.name,
      testType: test.type,
      totalScore: result.totalScore,
      maxPossibleScore: result.maxPossibleScore,
      percentageScore: Math.round(result.percentageScore * 100) / 100,
      skillGaps: result.skillGaps || [],
      recommendedPaths: result.recommendedPaths || [],
      isCompleted: result.isCompleted,
      completedAt: result.completedAt,
    };
  }
}
