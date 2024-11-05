import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('followed_companies')
  async followCompany() {
    // Implement logic to follow a company
  }
}
