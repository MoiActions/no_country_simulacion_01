import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCompanyCommand } from './CreateCompany.command';
import { CompanyUseCases } from 'src/modules/company-marketplace/core/use-cases/CompanyUseCases';
import { CreateCompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/CreateCompany.dto';
@CommandHandler(CreateCompanyCommand)
export class CreateCompanyHandler implements ICommandHandler<CreateCompanyCommand> {
  constructor(private companyUseCases: CompanyUseCases) {}

  async execute(command: CreateCompanyCommand): Promise<CreateCompanyDTO> {
    return this.companyUseCases.createCompany(command.companyData);
  }
}
