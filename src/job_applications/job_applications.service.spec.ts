import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationsService } from './job_applications.service';

describe('JobApplicationsService', () => {
  let service: JobApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobApplicationsService],
    }).compile();

    service = module.get<JobApplicationsService>(JobApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
