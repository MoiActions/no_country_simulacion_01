import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LearningService } from '../services/learning.service';
import {
  SubmitEvaluationDto,
  CompleteContentDto,
  CompleteCheckpointDto,
} from '../dto/submit-evaluation.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('learning')
@UseGuards(JwtAuthGuard)
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('paths')
  @Public()
  async getAllPaths() {
    return this.learningService.getAllPaths();
  }

  @Get('paths/:id')
  @Public()
  async getPathById(@Param('id') id: string) {
    return this.learningService.getPathById(id);
  }

  @Get('modules/:id')
  async getModuleById(@Param('id') id: string) {
    return this.learningService.getModuleById(id);
  }

  @Post('modules/:moduleId/contents/complete')
  async completeContent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Body() dto: CompleteContentDto,
  ) {
    return this.learningService.completeContent(user.id, moduleId, dto.contentId);
  }

  @Post('modules/:moduleId/checkpoints/:checkpointId/complete')
  async completeCheckpoint(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Param('checkpointId') checkpointId: string,
    @Body() dto: CompleteCheckpointDto,
  ) {
    return this.learningService.completeCheckpoint(
      user.id,
      moduleId,
      checkpointId,
      dto.selectedOptionId,
    );
  }

  @Post('modules/:moduleId/evaluation/submit')
  async submitEvaluation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Body() dto: SubmitEvaluationDto,
  ) {
    return this.learningService.submitEvaluation(user.id, moduleId, dto);
  }

  @Get('progress')
  async getUserProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.learningService.getUserProgress(user.id);
  }

  @Get('skills/validated')
  async getValidatedSkills(@CurrentUser() user: AuthenticatedUser) {
    return this.learningService.getValidatedSkills(user.id);
  }
}
