import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MarketplaceService } from '../../../services/marketplace.service';
import {
  ApplyToJobDto,
  UpdateApplicationStatusDto,
  CreateFeedbackDto,
  ShortlistCandidateDto,
  TalentSearchDto,
} from '../../../core/entities/application/dto/application.dto';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../common/guards/roles.guard';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../../../../common/interfaces/authenticated-user.interface';
import { UserRole } from '../../../../../common/enums/user-role.enum';

@Controller('marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('opportunities/:jobId/apply')
  async applyToJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('jobId') jobId: string,
    @Body() dto: ApplyToJobDto,
  ) {
    return this.marketplaceService.applyToJob(user.id, jobId, dto);
  }

  @Get('applications')
  async getMyApplications(@CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceService.getUserApplications(user.id);
  }

  @Get('applications/:id')
  async getApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.marketplaceService.getApplicationById(id, user.id);
  }

  @Get('applications/:id/feedback')
  async getApplicationFeedback(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.marketplaceService.getApplicationFeedback(id, user.id);
  }

  @Delete('applications/:id')
  async withdrawApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.marketplaceService.withdrawApplication(id, user.id);
    return { message: 'Application withdrawn successfully' };
  }

  @Get('talent/search')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async searchTalent(
    @CurrentUser() user: AuthenticatedUser,
    @Query() searchDto: TalentSearchDto,
  ) {
    return this.marketplaceService.searchTalent(user.id, searchDto);
  }

  @Post('talent/:userId/shortlist')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async addToShortlist(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
    @Query('companyId') companyId: string,
    @Body() dto: ShortlistCandidateDto,
  ) {
    return this.marketplaceService.addToShortlist(user.id, companyId, userId, dto);
  }

  @Get('shortlist')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async getShortlist(
    @CurrentUser() user: AuthenticatedUser,
    @Query('companyId') companyId: string,
  ) {
    return this.marketplaceService.getCompanyShortlist(user.id, companyId);
  }

  @Delete('talent/:userId/shortlist')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async removeFromShortlist(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
    @Query('companyId') companyId: string,
  ) {
    await this.marketplaceService.removeFromShortlist(user.id, companyId, userId);
    return { message: 'Candidate removed from shortlist' };
  }

  @Get('jobs/:jobId/applications')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async getJobApplications(
    @CurrentUser() user: AuthenticatedUser,
    @Param('jobId') jobId: string,
  ) {
    return this.marketplaceService.getJobApplications(user.id, jobId);
  }

  @Patch('applications/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async updateApplicationStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.marketplaceService.updateApplicationStatus(user.id, id, dto);
  }

  @Post('applications/:id/feedback')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async addFeedback(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.marketplaceService.addFeedback(user.id, id, dto);
  }
}
