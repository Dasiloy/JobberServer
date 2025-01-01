import { Module } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { Education } from './education.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Education])],
  providers: [EducationsService],
  exports: [EducationsService],
})
export class EducationsModule {}
