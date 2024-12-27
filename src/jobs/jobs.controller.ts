import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateJobDto } from './dtos/create.job.dto';
import { Serialize } from '@/addons/decorators/serialize.decorator';
import { JobDto } from './dtos/Job.dto';
import { JobsService } from './jobs.service';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { QueryJobDto } from './dtos/query,job.dto';
import { PaginationDto } from '../global/dtos/pagination.dto';
import { SingleJobDto } from './dtos/single.job.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Jobs')
@Controller({
  version: '1',
  path: 'jobs',
})
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(JobDto)
  @Post('')
  createJob(@Body() body: CreateJobDto) {
    return this.jobsService.createJob(body);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(JobDto)
  @Get('')
  getJobs(@Query() query: QueryJobDto) {
    return this.jobsService.getJobs(query);
  }

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
  @Serialize(SingleJobDto)
  @Get(':id')
  getJobB(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }
}
