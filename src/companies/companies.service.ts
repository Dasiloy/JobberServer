import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './companies.entity';
import { In, Repository } from 'typeorm';
import { User } from '@/users/users.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private repository: Repository<Company>,
  ) {}

  async getCompanies() {
    const companies = await this.repository.find();
    return {
      message: 'Companies retrieved successfully',
      data: companies,
    };
  }

  loadCompanies(data: any) {
    return this.repository.insert(data);
  }

  async followCompanies(user: User, company_ids: string[]) {
    const companies = await this.repository.find({
      where: { id: In(company_ids) },
      relations: ['followers'],
    });

    for (const company of companies) {
      if (!company.followers.find((follower) => follower.id === user.id)) {
        company.followers.push(user);
        await this.repository.save(company);
      }
    }

    return {
      message: 'Companies followed successfully',
      data: companies,
    };
  }
}
