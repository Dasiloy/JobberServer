import { Module } from '@nestjs/common';
import { WorkHistoriesService } from './work_histories.service';
import { WorkHistoriesController } from './work_histories.controller';

@Module({
  providers: [WorkHistoriesService],
  controllers: [WorkHistoriesController]
})
export class WorkHistoriesModule {}
