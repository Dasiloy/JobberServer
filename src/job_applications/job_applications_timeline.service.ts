import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplicationTimeline } from './job_applications_timeline.entity';
import { User } from '@/users/users.entity';

@Injectable()
export class JobApplicationsTimeLineService {
  constructor(
    @InjectRepository(JobApplicationTimeline)
    private readonly repository: Repository<JobApplicationTimeline>,
  ) {}

  findByJobApplicationId(id: string, user: User) {
    return this.repository.find({
      where: {
        job_application: {
          id,
          profile: {
            user: {
              id: user.id,
            },
          },
        },
      },
    });
  }

  create() {
    return this.repository.create();
  }

  save(jbt: JobApplicationTimeline) {
    return this.repository.save(jbt);
  }
}
