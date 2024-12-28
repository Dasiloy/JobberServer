import {
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

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly repository: Repository<Profile>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
    private readonly portfolioService: PortfoliosService,
    private readonly portfolioItemsService: PortfoliosItemsService,
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
}
