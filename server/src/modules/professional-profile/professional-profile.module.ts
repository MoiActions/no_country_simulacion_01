import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfessionalProfileController } from './presentation/http-server/controllers/professional-profile.controller';
import { ProfileExtendedController } from './controllers/profile-extended.controller';
import { ProfessionalProfileOrmEntity } from './persistence/postgres/entities/professional-profile.orm.entity';
import { WorkExperienceOrmEntity } from './persistence/postgres/entities/work-experience.orm.entity';
import { EducationOrmEntity } from './persistence/postgres/entities/education.orm.entity';
import { ProfessionalProfileProviders } from './shared/providers';
import { ProfileExtendedService } from './services/profile-extended.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      ProfessionalProfileOrmEntity,
      WorkExperienceOrmEntity,
      EducationOrmEntity,
    ]),
  ],
  providers: [...ProfessionalProfileProviders, ProfileExtendedService],
  controllers: [ProfessionalProfileController, ProfileExtendedController],
  exports: [TypeOrmModule, ProfileExtendedService],
})
export class ProfessionalProfileModule {}
