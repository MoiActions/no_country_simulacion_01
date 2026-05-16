import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProfileExtendedService } from '../services/profile-extended.service';
import {
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto,
} from '../core/entities/professional-profile/dto/work-experience.dto';
import {
  CreateEducationDto,
  UpdateEducationDto,
} from '../core/entities/professional-profile/dto/education.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('professional-profile')
@UseGuards(JwtAuthGuard)
export class ProfileExtendedController {
  constructor(private readonly profileService: ProfileExtendedService) {}

  @Get('full')
  async getFullProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profileService.getFullProfile(user.id);
  }

  @Get(':id/public')
  @Public()
  async getPublicProfile(@Param('id') id: string) {
    return this.profileService.getPublicProfile(id);
  }

  @Patch('pitch')
  async updatePitch(
    @CurrentUser() user: AuthenticatedUser,
    @Body('pitch') pitch: string,
  ) {
    return this.profileService.updatePitch(user.id, pitch);
  }

  @Post('work-experience')
  async addWorkExperience(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkExperienceDto,
  ) {
    return this.profileService.addWorkExperience(user.id, dto);
  }

  @Patch('work-experience/:id')
  async updateWorkExperience(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateWorkExperienceDto,
  ) {
    return this.profileService.updateWorkExperience(user.id, id, dto);
  }

  @Delete('work-experience/:id')
  async deleteWorkExperience(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.profileService.deleteWorkExperience(user.id, id);
    return { message: 'Work experience deleted successfully' };
  }

  @Post('education')
  async addEducation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateEducationDto,
  ) {
    return this.profileService.addEducation(user.id, dto);
  }

  @Patch('education/:id')
  async updateEducation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.profileService.updateEducation(user.id, id, dto);
  }

  @Delete('education/:id')
  async deleteEducation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.profileService.deleteEducation(user.id, id);
    return { message: 'Education deleted successfully' };
  }
}
