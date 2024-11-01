import { Test, TestingModule } from '@nestjs/testing';
import { WorkHistoriesService } from './work_histories.service';

describe('WorkHistoriesService', () => {
  let service: WorkHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkHistoriesService],
    }).compile();

    service = module.get<WorkHistoriesService>(WorkHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
