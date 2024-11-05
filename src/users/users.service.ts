import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  findByMail(email: string) {
    return this.repository.findOne({
      where: { email },
    });
  }

  findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ['profile', 'followed_companies'],
    });
  }

  findByIdWithoutRelations(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  createUser(user: Partial<User>) {
    const _user = this.repository.create(user);
    return this.repository.save(_user);
  }

  saveUser(user: User) {
    return this.repository.save(user);
  }
}
