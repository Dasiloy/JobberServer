import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profiles.entity';
import { Repository } from 'typeorm';
import { AuthService } from '@/auth/auth.service';
import { CreateSessionDto } from '@/auth/dtos/create_seession.dto';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';
import { UpdateProfileDto } from './dtos/update_profile.dto';
import { UploadService } from '@/upload/upload.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly repository: Repository<Profile>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  async createUserProfile(
    data: Partial<Profile>,
    { user: _user, nestSession, request }: CreateSessionDto,
  ) {
    const user = await this.usersService.findById(_user.id, {
      relations: ['profile', 'followed_companies'],
    });
    if (user.profile) {
      throw new ConflictException(
        'You already have a profile. Update your profile instead.',
      );
    }

    const access_token = await this.authService.createSession({
      user,
      nestSession,
      request,
    });
    const profile = this.repository.create(data);
    user.profile = profile;
    await this.usersService.saveUser(user);

    return {
      access_token,
      data: user,
      message: 'Profile created successfully.',
    };
  }

  async updateMyProfile(data: UpdateProfileDto, _user: User) {
    const user = await this.usersService.findById(_user.id, {
      relations: ['profile', 'followed_companies'],
    });
    if (!user.profile) {
      throw new NotFoundException('User does not have a profile.');
    }
    user.profile = Object.assign(user.profile, data);
    await this.usersService.saveUser(user);

    return {
      data: user,
      message: 'Profile updated successfully.',
    };
  }

  async uploadResume(file: Express.Multer.File, user: User) {
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
