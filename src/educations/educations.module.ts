import { Module } from '@nestjs/common';
import { EducationsService } from './educations.service';

@Module({
  providers: [EducationsService],
  exports: [EducationsService],
})
export class EducationsModule {}
