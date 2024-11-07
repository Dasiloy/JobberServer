import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  checkTokenExpiry(user: User, type: 'email' | 'phone' | 'password') {
    switch (type) {
      case 'email':
        return user.email_token_expired_at?.getTime() < Date.now();

      case 'phone':
        return user.phone_number_token_expired_at?.getTime() < Date.now();
      case 'password':
        return user.password_reset_token_expired_at?.getTime() < Date.now();
      default:
        return true;
    }
  }

  findById(id: string, options: Omit<FindOneOptions<User>, 'where'> = {}) {
    return this.repository.findOne({
      where: { id },
      ...options,
    });
  }

  findByMail(email: string, options: Omit<FindOneOptions<User>, 'where'> = {}) {
    return this.repository.findOne({
      where: { email },
      ...options,
    });
  }

  findByEmailOrPhone(
    query: string,
    options: Omit<FindOneOptions<User>, 'where'> = {},
  ) {
    return this.repository
      .createQueryBuilder('user')
      .where('user.email = :query', { query })
      .orWhere('CONCAT(user.country_code, user.phone_number) = :query', {
        query,
      })
      .setFindOptions(options)
      .getOne();
  }

  createUser(user: Partial<User>) {
    return this.repository.create(user);
  }

  saveUser(user: User) {
    return this.repository.save(user);
  }
}
