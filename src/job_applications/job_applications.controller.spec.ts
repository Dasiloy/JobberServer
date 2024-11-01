import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationsController } from './job_applications.controller';

describe('JobApplicationsController', () => {
  let controller: JobApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicationsController],
    }).compile();

    controller = module.get<JobApplicationsController>(JobApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
