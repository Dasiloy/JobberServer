import { Module } from '@nestjs/common';
import { WorkHistoriesService } from './work_histories.service';
import { WorkHistory } from './work_histories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WorkHistory])],
  providers: [WorkHistoriesService],
  exports: [WorkHistoriesService],
})
export class WorkHistoriesModule {}
