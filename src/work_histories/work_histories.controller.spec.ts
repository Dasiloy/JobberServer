import { Test, TestingModule } from '@nestjs/testing';
import { WorkHistoriesController } from './work_histories.controller';

describe('WorkHistoriesController', () => {
  let controller: WorkHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkHistoriesController],
    }).compile();

    controller = module.get<WorkHistoriesController>(WorkHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
