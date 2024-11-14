import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateJobDto } from './dtos/create.job.dto';
import { Serialize } from '@/addons/decorators/serialize.decorator';
import { JobDto } from './dtos/Job.dto';
import { JobsService } from './jobs.service';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { PaginationDto } from '@/addons/interfaces/paginator.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(JobDto)
  @Post('')
  createJob(@Body() body: CreateJobDto) {
    return this.jobsService.createJob(body);
  }

  @Get('')
  getJobs() {}

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(JobDto)
  @Get('recommended')
  getRecommendedJobs(@CurrentUser() user: User, @Query() query: PaginationDto) {
    return this.jobsService.getRecommendedJobs(user, query);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(JobDto)
  @Get('latest')
  getLatestJobs() {
    return this.jobsService.getLatestJobs();
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(JobDto)
  @Get(':id')
  getJobB(@Param('id') id: string) {
    return id;
  }
}
