import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from './job_applications.entity';
import { DataSource, Repository, FindOneOptions } from 'typeorm';
import { User } from '@/users/users.entity';
import { JobsService } from '@/jobs/jobs.service';
import { JobApplyDto } from './dtos/apply.job.dto';
import { ServerResponse } from '@/addons/interfaces/response.interface';
import { ProfilesService } from '@/profiles/profiles.service';
import { JobApplicationTimelineStatus } from '@/jobs/jobs.enum';
import { JobApplicationsTimeLineService } from './job_applications_timeline.service';
import { GetJobApplicationQueryDto } from './dtos/get.job.applications';
import { JobApplicationTimeline } from './job_applications_timeline.entity';
import { PaginatorService } from '@/global/pagination.service';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly repository: Repository<JobApplication>,
    private readonly jobApplicationTimelineService: JobApplicationsTimeLineService,
    private readonly profileService: ProfilesService,
    private readonly jobService: JobsService,
    private readonly dataSource: DataSource,
    private readonly paginatorService: PaginatorService,
  ) {}

  async findJobApplicationById(
    id: string,
    options: Omit<FindOneOptions<JobApplication>, 'where'> = {},
  ) {
    return this.repository.findOne({
      where: { id },
      ...options,
    });
  }

  async applyForJob(
    user: User,
    { job_id, cover_letter }: JobApplyDto,
  ): ServerResponse<JobApplication> {
    const job = await this.jobService.FindById(job_id);

    if (!job) {
      throw new BadRequestException('Job not found');
    }

    const profile = await this.profileService.findByUserId(user.id);

    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    const user_application = await this.repository
      .createQueryBuilder('job_application')
      .leftJoinAndSelect('job_application.job', 'job')
      .leftJoinAndSelect('job_application.profile', 'profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id = :user_id', { user_id: user.id })
      .andWhere('job.id = :job_id', { job_id })
      .getOne();

    if (user_application) {
      throw new BadRequestException('You have already applied for this job');
    }

    const application = this.repository.create({
      job,
      profile,
      cover_letter,
    });

    const timeline = this.jobApplicationTimelineService.create();

    timeline.job_application = application;
    timeline.notes = 'Application submitted';
    timeline.status = JobApplicationTimelineStatus.COMPLETED;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.repository.save(application);
      await this.jobApplicationTimelineService.save(timeline);
      await queryRunner.commitTransaction();
      return {
        data: application,
        message: 'Job application created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getJobApplications({
    job_id,
    page,
    limit,
  }: GetJobApplicationQueryDto): ServerResponse<JobApplication[]> {
    const query = this.repository
      .createQueryBuilder('job_application')
      .leftJoinAndSelect('job_application.job', 'job')
      .leftJoinAndSelect('job.company', 'company');

    if (job_id) {
      query.where('job.id = :job_id', { job_id });
    }

    const [data, totalCount] = await query
      .orderBy('job.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      message: 'Job applications fetched successfully',
      pagination: this.paginatorService.paginate({
        count: totalCount,
        limit,
        page,
        page_size: limit,
      }),
    };
  }

  async getJobApplication(
    id: string,
    user: User,
  ): ServerResponse<JobApplication> {
    const job_application = await this.repository
      .createQueryBuilder('job_application')
      .leftJoinAndSelect('job_application.job', 'job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job_application.profile', 'profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('job_application.id = :id', { id })
      .andWhere('user.id = :user_id', { user_id: user.id })
      .getOne();

    return {
      data: job_application,
      message: 'Job application fetched successfully',
    };
  }

  async getJobApplicationTimeline(
    id: string,
    user: User,
  ): ServerResponse<JobApplicationTimeline[]> {
    {
      const timeline =
        await this.jobApplicationTimelineService.findByJobApplicationId(
          id,
          user,
        );

      return {
        data: timeline,
        message: 'Job application timeline fetched successfully',
      };
    }
  }
}
