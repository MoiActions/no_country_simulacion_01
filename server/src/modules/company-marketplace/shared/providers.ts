import { Provider } from '@nestjs/common';
import { CompanyRepository } from '../core/data/CompanyRepository';
import { JobOpportunityRepository } from '../core/data/JobOpportunityRepository';
import { CompanyUseCases } from '../core/use-cases/CompanyUseCases';
import { JobsUseCases } from '../core/use-cases/JobsUseCases';
import { PostgresCompanyRepository } from '../persistence/postgres/repositories/postgres.company.repository';
import { PostgresJobOpportunityRepository } from '../persistence/postgres/repositories/postgres.job-opportunity.repository';
import {
  COMPANY_REPOSITORY,
  COMPANY_USE_CASES,
  JOB_OPPORTUNITY_REPOSITORY,
  JOB_USE_CASES,
} from './constants';

const CompanyRepositoryCustomProvider = {
  provide: COMPANY_REPOSITORY,
  useClass: PostgresCompanyRepository,
};

const JobOpportunityRepositoryCustomProvider = {
  provide: JOB_OPPORTUNITY_REPOSITORY,
  useClass: PostgresJobOpportunityRepository,
};

const CompanyUseCasesProviderCustomProvider = {
  provide: COMPANY_USE_CASES,
  useFactory: (companyRepository: CompanyRepository) => {
    return new CompanyUseCases(companyRepository);
  },
  inject: [COMPANY_REPOSITORY],
};

const JobUseCasesProviderCustomProvider = {
  provide: JOB_USE_CASES,
  useFactory: (
    jobOpportunityRepository: JobOpportunityRepository,
    companyRepository: CompanyRepository,
  ) => {
    return new JobsUseCases(companyRepository, jobOpportunityRepository);
  },
  inject: [JOB_OPPORTUNITY_REPOSITORY, COMPANY_REPOSITORY],
};

export const CompanyMarketplaceProviders: Provider[] = [
  CompanyRepositoryCustomProvider,
  JobOpportunityRepositoryCustomProvider,
  CompanyUseCasesProviderCustomProvider,
  JobUseCasesProviderCustomProvider,
];
