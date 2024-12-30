import { Injectable } from '@nestjs/common';
import { WorkHistory } from './work_histories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class WorkHistoriesService {
  constructor(
    @InjectRepository(WorkHistory)
    private readonly repository: Repository<WorkHistory>,
  ) {}

  findById(
    portfolioItemId: string,
    filters: FindOneOptions<WorkHistory>['where'] = {},
    options: Omit<FindOneOptions<WorkHistory>, 'where'> = {},
  ) {
    return this.repository.findOne({
      where: {
        id: portfolioItemId,
        ...filters,
      },
      ...options,
    });
  }

  createWorkHistory() {
    return this.repository.create();
  }

  saveWorkHistory(workHistory: WorkHistory) {
    return this.repository.save(workHistory);
  }

  deleteWorkHistory(workHistory: WorkHistory) {
    return this.repository.remove(workHistory);
  }
}
