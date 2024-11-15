import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './companies.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import { User } from '@/users/users.entity';
import { ServerResponse } from '@/addons/interfaces/response.interface';
import { PaginationDto } from '@/global/dtos/pagination.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private repository: Repository<Company>,
  ) {}

  findById(id: string, options: Omit<FindOneOptions<Company>, 'where'> = {}) {
    return this.repository.findOne({
      where: { id },
      ...options,
    });
  }

  async getCompanies({
    page,
    limit,
  }: PaginationDto): ServerResponse<Company[]> {
    const companies = await this.repository
      .createQueryBuilder('company')
      .leftJoin('company.jobs', 'job')
      .leftJoin('company.followers', 'follower')
      .leftJoin('company.employments', 'employment')
      .select('company.*')
      .addSelect('COUNT(follower.id)', 'followers_count')
      .addSelect('COUNT(DISTINCT job.id)', 'jobs_count')
      .addSelect('COUNT(DISTINCT employment.id)', 'employments_count')
      .groupBy('company.id')
      .orderBy('company.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return {
      message: 'Companies retrieved successfully',
      data: companies,
    };
  }

  async getCompany(id: string): ServerResponse<Company> {
    const company = await this.findById(id, {
      relations: ['followers', 'jobs', 'employments'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      message: 'Companies retrieved successfully',
      data: company,
    };
  }

  async loadCompanies(data: any): ServerResponse<string[]> {
    const response = await this.repository.insert(data);
    return {
      message: 'Companies loaded successfully',
      data: response.identifiers.map((company) => company.id),
    };
  }

  async followCompanies(
    user: User,
    company_ids: string[],
  ): ServerResponse<Company[]> {
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
