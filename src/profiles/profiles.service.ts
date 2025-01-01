import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profiles.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { AuthService } from '@/auth/auth.service';
import { CreateSessionDto } from '@/auth/dtos/create_seession.dto';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';
import { UpdateProfileDto } from './dtos/update_profile.dto';
import { UploadService } from '@/global/upload.service';
import { ServerResponse } from '@/addons/interfaces/response.interface';
import { PortfoliosService } from '@/portfolios/portfolios.service';
import { PortfolioItem } from '@/portfolios/portfolios_item.entity';
import { PortfoliosItemsService } from '@/portfolios/portfolios_item.service';
import { CreateProfilePortfolioItemDto } from './dtos/create_profile_portfolio_item.dto';
import { CreateProfileWorkHistoryDto } from './dtos/create_profile_work_history.dto';
import { WorkHistoriesService } from '@/work_histories/work_histories.service';
import { CompaniesService } from '../companies/companies.service';
import { Company } from '@/companies/companies.entity';
import { WorkHistory } from '@/work_histories/work_histories.entity';
import { EducationsService } from '@/educations/educations.service';
import { CreateProfileEducationDto } from './dtos/create_profile_education.dto';
import { Education } from '@/educations/education.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly repository: Repository<Profile>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
    private readonly portfolioService: PortfoliosService,
    private readonly portfolioItemsService: PortfoliosItemsService,
    private readonly workHistoryService: WorkHistoriesService,
    private readonly companyService: CompaniesService,
    private readonly educationService: EducationsService,
  ) {}

  findById(id: string, options: Omit<FindOneOptions<Profile>, 'where'> = {}) {
    return this.repository.findOne({
      where: { id },
      ...options,
    });
  }

  findByUserId(
    user_id: string,
    options: Omit<FindOneOptions<Profile>, 'where'> = {},
  ) {
    return this.repository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
      ...options,
    });
  }

  async createUserProfile(
    data: Partial<Profile>,
    { user, nestSession, request }: CreateSessionDto,
  ): ServerResponse<Profile> {
    let profile = await this.findByUserId(user.id);
    if (profile) {
      throw new ConflictException(
        'You already have a profile. Update your profile instead.',
      );
    }

    profile = this.repository.create({
      ...data,
      portfolio: this.portfolioService.createPortfolio(),
    });
    user.profile = profile;
    await this.usersService.saveUser(user);

    const access_token = await this.authService.createSession({
      user,
      nestSession,
      request,
    });

    return {
      access_token,
      data: user.profile,
      message: 'Profile created successfully.',
    };
  }

  async getCurrentUserProfile(user: User): ServerResponse<Profile> {
    const profile = await this.repository
      .createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .leftJoinAndSelect('profile.educations', 'education')
      .leftJoinAndSelect('profile.work_history', 'work_history')
      .leftJoinAndSelect('work_history.company', 'company')
      .leftJoinAndSelect('profile.portfolio', 'portfolio')
      .leftJoinAndSelect('portfolio.portfolio_items', 'portfolio_item')
      .where('user.id = :user_id', { user_id: user.id })
      .getOne();

    return {
      data: profile,
      message: 'Profile fetched successfully.',
    };
  }

  async updateMyProfile(
    data: UpdateProfileDto,
    user: User,
  ): ServerResponse<Profile> {
    const profile = await this.findByUserId(user.id);
    if (!profile) {
      throw new NotFoundException('User does not have a profile.');
    }
    user.profile = Object.assign(profile, data);
    await this.usersService.saveUser(user);

    console.log(user.profile);

    return {
      data: user.profile,
      message: 'Profile updated successfully.',
    };
  }

  async uploadResume(
    file: Express.Multer.File,
    user: User,
  ): ServerResponse<Profile> {
    const profile = await this.findByUserId(user.id);
    if (!profile) {
      throw new NotFoundException('User does not have a profile.');
    }

    profile.resume_url = await this.uploadService.uploadFile({
      file,
      user,
      folder: 'resumes',
    });
    user.profile = profile;
    await this.usersService.saveUser(user);

    return {
      data: user.profile,
      message: 'Resume uploaded successfully.',
    };
  }

  async uploadPortfolioItem(
    file: Express.Multer.File,
    user: User,
  ): ServerResponse<string> {
    const portfolio_item_url = await this.uploadService.uploadFile({
      file,
      user,
      folder: 'portfolios',
    });

    return {
      data: portfolio_item_url,
      message: 'Portfolio item uploaded successfully.',
    };
  }

  async createProfilePortfolioItem(
    data: CreateProfilePortfolioItemDto,
    user: User,
  ): ServerResponse<PortfolioItem> {
    const profile = await this.findByUserId(user.id, {
      relations: ['portfolio'],
    });

    if (!profile) {
      throw new NotFoundException('User does not have a profile.');
    }

    if (!profile.portfolio) {
      throw new NotFoundException("User's profile doesn't have a portfolio.");
    }

    const portfolioItem = this.portfolioItemsService.createPortfolioItem();
    portfolioItem.title = data.title;
    portfolioItem.description = data.description;
    portfolioItem.portfolio_item_url = data.portfolio_item_url;
    portfolioItem.portfolio = profile.portfolio;

    profile.portfolio.portfolio_items.push(portfolioItem);
    await this.repository.save(profile);

    return {
      data: portfolioItem,
      message: 'Portfolio item created successfully.',
    };
  }

  async updatePortfolioItem(
    portfolioItemId: string,
    data: CreateProfilePortfolioItemDto,
    user: User,
  ): ServerResponse<PortfolioItem> {
    const profile = await this.findByUserId(user.id, {
      relations: ['portfolio'],
    });

    if (!profile) {
      throw new NotFoundException('No portfolio found.');
    }

    if (!profile.portfolio) {
      throw new NotFoundException('No portfolio found.');
    }

    const portfolioItem = await this.portfolioItemsService.findById(
      portfolioItemId,
      {
        portfolio: {
          id: profile.portfolio.id,
        },
      },
    );

    if (!portfolioItem) {
      throw new NotFoundException('Portfolio item not found.');
    }

    const updatedPortfolioItem =
      await this.portfolioItemsService.savePortfolioItem(
        Object.assign(portfolioItem, data),
      );

    return {
      data: updatedPortfolioItem,
      message: 'Portfolio item updated successfully.',
    };
  }

  async deletePortfolioItem(
    portfolioItemId: string,
    user: User,
  ): ServerResponse {
    const profile = await this.findByUserId(user.id, {
      relations: ['portfolio'],
    });

    if (!profile) {
      throw new NotFoundException('No portfolio found.');
    }

    if (!profile.portfolio) {
      throw new NotFoundException('No portfolio found.');
    }

    const portfolioItem = await this.portfolioItemsService.findById(
      portfolioItemId,
      {
        portfolio: {
          id: profile.portfolio.id,
        },
      },
    );

    if (!portfolioItem) {
      throw new NotFoundException('Portfolio item not found.');
    }

    await this.portfolioItemsService.deletePortfolioItem(portfolioItem);

    return {
      message: 'Portfolio item deleted successfully.',
    };
  }

  async createProfileWorkHistory(
    data: CreateProfileWorkHistoryDto,
    user: User,
  ): ServerResponse<WorkHistory> {
    const profile = await this.findByUserId(user.id, {
      relations: ['work_history'],
    });

    if (!profile) {
      throw new NotFoundException('No profile found.');
    }

    // check if we  have company id
    let company: Company;
    if (data.company_id) {
      company = await this.companyService.findById(data.company_id);
      if (!company) {
        throw new NotFoundException('Company not found.');
      }
    }

    const workHistory = this.workHistoryService.createWorkHistory();
    workHistory.title = data.title;
    workHistory.job_type = data.job_type;
    workHistory.job_location = data.job_location;
    workHistory.start_date = new Date(data.start_date);
    if (data.end_date) workHistory.end_date = new Date(data.end_date);

    if (company) {
      workHistory.company = company;
    } else {
      workHistory.company_name = data.company_name;
      workHistory.company_address = data.company_address;
    }

    profile.work_history.push(workHistory);
    await this.repository.save(profile);

    return {
      data: workHistory,
      message: 'Work history created successfully.',
    };
  }

  async updateProfileWorkHistory(
    workHistoryId: string,
    data: CreateProfileWorkHistoryDto,
    user: User,
  ): ServerResponse<WorkHistory> {
    const profile = await this.findByUserId(user.id, {
      relations: ['work_history'],
    });

    if (!profile) {
      throw new NotFoundException('No profile found.');
    }

    const workHistory = await this.workHistoryService.findById(
      workHistoryId,
      {
        profile: {
          id: profile.id,
        },
      },
      {
        relations: ['company'],
      },
    );

    if (!workHistory) {
      throw new NotFoundException('Work history not found.');
    }

    const { company_id, company_name, company_address, ...workHistoryData } =
      data;

    const updatedWorkHistory = Object.assign(workHistory, workHistoryData);

    if (company_id) {
      const company = await this.companyService.findById(company_id);
      if (!company) {
        throw new NotFoundException('Company not found.');
      }
      updatedWorkHistory.company = company;
      updatedWorkHistory.company_name = null;
      updatedWorkHistory.company_address = null;
    } else if (company_name || company_address) {
      updatedWorkHistory.company = null;
      if (company_name) updatedWorkHistory.company_name = company_name;
      if (company_address) updatedWorkHistory.company_address = company_address;

      if (
        !updatedWorkHistory.company_name ||
        !updatedWorkHistory.company_address
      ) {
        throw new BadRequestException('Company name and address is required.');
      }
    }

    await this.workHistoryService.saveWorkHistory(updatedWorkHistory);
    return {
      data: updatedWorkHistory,
      message: 'Work history updated successfully.',
    };
  }

  async deleteProfileWorkHistory(
    workHistoryId: string,
    user: User,
  ): ServerResponse {
    const profile = await this.findByUserId(user.id, {
      relations: ['work_history'],
    });

    if (!profile) {
      throw new NotFoundException('No profile found.');
    }

    const workHistory = await this.workHistoryService.findById(workHistoryId, {
      profile: {
        id: profile.id,
      },
    });

    if (!workHistory) {
      throw new NotFoundException('Work history not found.');
    }

    await this.workHistoryService.deleteWorkHistory(workHistory);

    return {
      message: 'Work history deleted successfully.',
    };
  }

  async createProfileEducation(
    data: CreateProfileEducationDto,
    user: User,
  ): ServerResponse<Education> {
    const profile = await this.findByUserId(user.id, {
      relations: ['educations'],
    });

    if (!profile) {
      throw new NotFoundException('No profile found.');
    }

    const education = this.educationService.createEducation();
    education.institution = data.institution;
    education.degree = data.degree;
    education.course = data.course;
    education.start_date = new Date(data.start_date);
    if (data.end_date) education.end_date = new Date(data.end_date);

    profile.educations.push(education);
    await this.repository.save(profile);

    return {
      data: education,
      message: 'Education created successfully.',
    };
  }

  async updateProfileEducation(
    educationId: string,
    data: CreateProfileEducationDto,
    user: User,
  ): ServerResponse<Education> {
    const profile = await this.findByUserId(user.id, {
      relations: ['educations'],
    });

    if (!profile) {
      throw new NotFoundException('No profile found.');
    }

    const education = await this.educationService.findById(educationId, {
      profile: {
        id: profile.id,
      },
    });

    if (!education) {
      throw new NotFoundException('Education not found.');
    }

    const updatedEducation = Object.assign(education, data);
    await this.educationService.saveEducation(updatedEducation);

    return {
      data: updatedEducation,
      message: 'Education updated successfully.',
    };
  }

  async deleteProfileEducation(
    educationId: string,
    user: User,
  ): ServerResponse {
    const profile = await this.findByUserId(user.id, {
      relations: ['educations'],
    });

    if (!profile) {
      throw new NotFoundException('No profile found.');
    }

    const education = await this.educationService.findById(educationId, {
      profile: {
        id: profile.id,
      },
    });

    if (!education) {
      throw new NotFoundException('Education not found.');
    }

    await this.educationService.deleteEducation(education);

    return {
      message: 'Education deleted successfully.',
    };
  }
}
