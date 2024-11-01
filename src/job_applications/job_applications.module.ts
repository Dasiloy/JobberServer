import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationsController } from './job_applications.controller';

@Module({
  providers: [JobApplicationsService],
  controllers: [JobApplicationsController]
})
export class JobApplicationsModule {}
