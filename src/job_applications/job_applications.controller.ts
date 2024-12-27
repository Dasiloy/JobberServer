import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { JobApplyDto } from './dtos/apply.job.dto';
import { GetJobApplicationQueryDto } from './dtos/get.job.applications';
import { Serialize } from '@/addons/decorators/serialize.decorator';
import { JobApplicationTimeLineDto } from './dtos/application.timeline.dto';
import { ApplicationDto } from './dtos/application.dto';
import { SingleApplicationDto } from './dtos/single.application.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Job Application')
@Controller({
  version: '1',
  path: 'job-applications',
})
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(ApplicationDto)
  @Post('')
  createJobApplication(@CurrentUser() user: User, @Body() body: JobApplyDto) {
    return this.jobApplicationsService.applyForJob(user, body);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(ApplicationDto)
  @Get('')
  getAllJobApplications(@Query() query: GetJobApplicationQueryDto) {
    return this.jobApplicationsService.getJobApplications(query);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(SingleApplicationDto)
  @Get(':id')
  getJobApplicationById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.jobApplicationsService.getJobApplication(id, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(JobApplicationTimeLineDto)
  @Get(':id/timeline')
  getJobApplicationTimeline(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.jobApplicationsService.getJobApplicationTimeline(id, user);
  }
}
