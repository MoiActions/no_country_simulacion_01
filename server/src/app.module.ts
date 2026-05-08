import { Module } from '@nestjs/common';
import { CompanyMarketplaceModule } from './modules/company-marketplace/company-marketplace.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CompanyMarketplaceModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
