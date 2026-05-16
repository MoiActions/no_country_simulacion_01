import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompanyMarketplaceModule } from './modules/company-marketplace/company-marketplace.module';
import { ProfessionalProfileModule } from './modules/professional-profile/professional-profile.module';
import { DiagnosisModule } from './modules/diagnosis/diagnosis.module';
import { LearningModule } from './modules/learning/learning.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    DiagnosisModule,
    LearningModule,
    CompanyMarketplaceModule,
    ProfessionalProfileModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
