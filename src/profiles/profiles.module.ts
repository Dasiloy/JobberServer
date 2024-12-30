import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PortfoliosModule } from '@/portfolios/portfolios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profiles.entity';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { EducationsModule } from '@/educations/educations.module';
import { WorkHistoriesModule } from '@/work_histories/work_histories.module';
import { CompaniesModule } from '@/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    AuthModule,
    UsersModule,
    PortfoliosModule,
    EducationsModule,
    WorkHistoriesModule,
    CompaniesModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
