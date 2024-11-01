import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { WorksModule } from './works/works.module';
import { EducationsModule } from './educations/educations.module';
import { CompaniesModule } from './companies/companies.module';
import { JobApplicationsModule } from './job_applications/job_applications.module';
import { WorkHistoriesModule } from './work_histories/work_histories.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    JobsModule,
    ProfilesModule,
    AuthModule,
    WorksModule,
    EducationsModule,
    CompaniesModule,
    JobApplicationsModule,
    WorkHistoriesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
