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

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly repository: Repository<Profile>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  findById(id: string, options: Omit<FindOneOptions<Profile>, 'where'> = {}) {
    return this.repository.findOne({
      where: { id },
      ...options,
    });
  }

  findByUserId(user_id: string) {
    return this.repository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
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

    const access_token = await this.authService.createSession({
      user,
      nestSession,
      request,
    });
    profile = this.repository.create(data);
    user.profile = profile;
    await this.usersService.saveUser(user);

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

    return {
      data: user.profile,
      message: 'Profile updated successfully.',
    };
  }

  async uploadResume(
    file: Express.Multer.File,
    user: User,
  ): ServerResponse<string> {
    const resume_url = await this.uploadService.uploadFile({
      file,
      user,
      folder: 'resumes',
    });

    return {
      data: resume_url,
      message: 'Resume uploaded successfully.',
    };
  }
}
