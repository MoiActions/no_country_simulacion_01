import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';
import { Paginated } from 'src/modules/company-marketplace/core/shared/helpers/paginated.helper';
import { JobOpportunityDTO } from 'src/modules/company-marketplace/core/entities/job-opportunity/dto/JobOpportunity.dto';
import { JobUseCasesProvider } from 'src/modules/company-marketplace/core/use-cases/JobsUseCases';
import { GetJobsDTO } from 'src/modules/company-marketplace/core/entities/job-opportunity/dto/GetJobs.dto';
import { JOB_USE_CASES } from 'src/modules/company-marketplace/shared/constants';
import { CreateJobOpportunityDTO } from 'src/modules/company-marketplace/core/entities/job-opportunity/dto/CreateJobOpportunity.dto';

@Controller('job')
export class JobController {
  constructor(
    @Inject(JOB_USE_CASES) private jobUseCases: JobUseCasesProvider,
  ) {}

  @Post()
  async createJobOpportunityForCompany(
    @Body() jobOpportunityData: CreateJobOpportunityDTO,
  ): Promise<JobOpportunityDTO> {
    try {
      const result =
        await this.jobUseCases.createJobOpportunityForCompany(
          jobOpportunityData,
        );
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create job opportunity',
      );
    }
  }

  @Get()
  async getJobs(
    @Query() getJobsRequest: GetJobsDTO,
  ): Promise<Paginated<JobOpportunityDTO>> {
    try {
      return this.jobUseCases.getJobs(getJobsRequest);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to fetch job opportunities: ' + error.message,
      );
    }
  }
}
