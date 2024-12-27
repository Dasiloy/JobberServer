import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
