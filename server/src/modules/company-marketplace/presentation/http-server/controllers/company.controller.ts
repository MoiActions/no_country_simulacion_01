import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/Company.dto';
import { Paginated } from 'src/modules/company-marketplace/core/shared/helpers/paginated.helper';
import { CreateCompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/CreateCompany.dto';
import { CompanyUseCasesProvider } from 'src/modules/company-marketplace/core/use-cases/CompanyUseCases';
import { GetCompaniesDTO } from 'src/modules/company-marketplace/core/entities/company/dto/GetCompanies.dto';
import { COMPANY_USE_CASES } from 'src/modules/company-marketplace/shared/constants';

@Controller('company')
export class CompanyController {
  constructor(
    @Inject(COMPANY_USE_CASES) private companyUseCases: CompanyUseCasesProvider,
  ) {}

  @Post()
  async createCompany(
    @Body() companyData: CreateCompanyDTO,
  ): Promise<CreateCompanyDTO> {
    try {
      const result = await this.companyUseCases.createCompany(companyData);
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  @Get()
  async getCompanies(
    @Query() getCompanies: GetCompaniesDTO,
  ): Promise<Paginated<CompanyDTO>> {
    try {
      const result = await this.companyUseCases.getCompanies(getCompanies);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get companies');
    }
  }
}
