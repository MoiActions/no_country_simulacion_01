import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DiagnosisService } from '../services/diagnosis.service';
import { SubmitDiagnosisDto } from '../dto/submit-diagnosis.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('diagnosis')
@UseGuards(JwtAuthGuard)
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Get('tests')
  @Public()
  async getAvailableTests() {
    return this.diagnosisService.getAvailableTests();
  }

  @Get('tests/:id/questions')
  async getTestQuestions(@Param('id') testId: string) {
    return this.diagnosisService.getTestQuestions(testId);
  }

  @Post('submit')
  async submitDiagnosis(
    @CurrentUser() user: AuthenticatedUser,
    @Body() submitDto: SubmitDiagnosisDto,
  ) {
    return this.diagnosisService.submitDiagnosis(user.id, submitDto);
  }

  @Get('results')
  async getUserResults(@CurrentUser() user: AuthenticatedUser) {
    return this.diagnosisService.getUserResults(user.id);
  }

  @Get('recommended-path')
  async getRecommendedPath(@CurrentUser() user: AuthenticatedUser) {
    return this.diagnosisService.getRecommendedPath(user.id);
  }
}
