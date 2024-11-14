import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs.entity';
import { CompaniesModule } from '@/companies/companies.module';
import { UsersModule } from '@/users/users.module';
import { PaginatorService } from '@/addons/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), CompaniesModule, UsersModule],
  controllers: [JobsController],
  providers: [JobsService, PaginatorService],
})
export class JobsModule {}
