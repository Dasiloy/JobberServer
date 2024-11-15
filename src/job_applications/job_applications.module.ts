import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationsController } from './job_applications.controller';
import { JobsModule } from '@/jobs/jobs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './job_applications.entity';
import { JobApplicationTimeline } from './job_applications_timeline.entity';
import { JobApplicationsTimeLineService } from './job_applications_timeline.service';
import { ProfilesModule } from '@/profiles/profiles.module';

@Module({
  imports: [
    JobsModule,
    ProfilesModule,
    TypeOrmModule.forFeature([JobApplication, JobApplicationTimeline]),
  ],
  providers: [JobApplicationsService, JobApplicationsTimeLineService],
  controllers: [JobApplicationsController],
})
export class JobApplicationsModule {}
