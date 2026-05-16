import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CompanyController } from './presentation/http-server/controllers/company.controller';
import { JobController } from './presentation/http-server/controllers/job.controller';
import { MarketplaceController } from './presentation/http-server/controllers/marketplace.controller';
import { CompanyMarketplaceProviders } from './shared/providers';
import { MarketplaceService } from './services/marketplace.service';
import { CompanyOrmEntity } from './persistence/postgres/entities/company.orm.entity';
import { JobOpportunityOrmEntity } from './persistence/postgres/entities/job-opportunity.orm.entity';
import { ApplicationOrmEntity } from './persistence/postgres/entities/application.orm.entity';
import { ApplicationFeedbackOrmEntity } from './persistence/postgres/entities/application-feedback.orm.entity';
import { CandidateShortlistOrmEntity } from './persistence/postgres/entities/candidate-shortlist.orm.entity';
import { ProfessionalProfileOrmEntity } from '../professional-profile/persistence/postgres/entities/professional-profile.orm.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      CompanyOrmEntity,
      JobOpportunityOrmEntity,
      ApplicationOrmEntity,
      ApplicationFeedbackOrmEntity,
      CandidateShortlistOrmEntity,
      ProfessionalProfileOrmEntity,
    ]),
  ],
  providers: [...CompanyMarketplaceProviders, MarketplaceService],
  controllers: [CompanyController, JobController, MarketplaceController],
  exports: [TypeOrmModule, MarketplaceService],
})
export class CompanyMarketplaceModule {}
