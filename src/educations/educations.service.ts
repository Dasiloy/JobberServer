import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './education.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class EducationsService {
  constructor(
    @InjectRepository(Education)
    private repository: Repository<Education>,
  ) {}

  findById(
    portfolioItemId: string,
    filters: FindOneOptions<Education>['where'] = {},
    options: Omit<FindOneOptions<Education>, 'where'> = {},
  ) {
    return this.repository.findOne({
      where: {
        id: portfolioItemId,
        ...filters,
      },
      ...options,
    });
  }

  createEducation() {
    return this.repository.create();
  }

  saveEducation(education: Education) {
    return this.repository.save(education);
  }

  deleteEducation(education: Education) {
    return this.repository.remove(education);
  }
}
