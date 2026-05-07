import { Module } from '@nestjs/common';
import { CompanyMarketplaceModule } from './modules/company-marketplace/company-marketplace.module';

@Module({
  imports: [CompanyMarketplaceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
