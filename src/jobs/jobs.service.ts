import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Job } from './jobs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJobDto } from './dtos/create.job.dto';
import { ServerResponse } from '@/addons/interfaces/response.interface';
import { CompaniesService } from '@/companies/companies.service';
import { User } from '@/users/users.entity';
import { UsersService } from '@/users/users.service';
import { PaginatorService } from '@/addons/services/pagination.service';
import { PaginationDto } from '@/addons/interfaces/paginator.interface';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly repository: Repository<Job>,
    private readonly userService: UsersService,
    private readonly paginatorService: PaginatorService,
    private readonly companyService: CompaniesService,
  ) {}

  async createJob(job: CreateJobDto): ServerResponse<Job> {
    const company = await this.companyService.findById(job.company_id);

    if (!company) {
      throw new NotFoundException('company not found');
    }

    const newJob = this.repository.create(job);
    newJob.company = company;

    await this.repository.save(newJob);

    return {
      message: 'Job created successfully',
      data: newJob,
    };
  }

  async getLatestJobs(): ServerResponse<Job[]> {
    const jobs = await this.repository.find({
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      message: 'Latest jobs fetched successfully',
      data: jobs,
    };
  }

  async getRecommendedJobs(
    user: User,
    { page, limit }: PaginationDto,
  ): ServerResponse<Job[]> {
    const full_user = await this.userService.findById(user.id, {
      relations: {
        profile: true,
        followed_companies: true,
      },
    });

    const [jobs, count] = await this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where('company.id IN (:...company_ids)', {
        company_ids: full_user.followed_companies.map((c) => c.id),
      })
      .orWhere('job.title ILIKE :title', {
        title: `%${full_user.profile.job_profession}%`,
      })
      .orWhere('job.types && :job_types', {
        job_types: full_user.profile.job_types,
      })
      .orWhere('job.locations && :locations', {
        locations: full_user.profile.job_locations,
      })
      .orWhere('job.experiences && :experiences', {
        experiences: full_user.profile.job_experiences,
      })
      .orderBy('job.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Recommended jobs fetched successfully',
      pagination: this.paginatorService.paginate({
        count,
        limit,
        page,
        page_size: jobs.length,
      }),
      data: jobs,
    };
  }
}
