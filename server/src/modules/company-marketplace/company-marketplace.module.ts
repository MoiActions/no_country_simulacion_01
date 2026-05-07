import { Module } from '@nestjs/common';
import { CompanyController } from './presentation/http-server/controllers/company.controller';
import { JobController } from './presentation/http-server/controllers/job.controller';
import { CompanyMarketplaceProviders } from './shared/providers';

@Module({
  providers: CompanyMarketplaceProviders,
  controllers: [CompanyController, JobController],
})
export class CompanyMarketplaceModule {}
