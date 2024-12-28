import {
  StandardResponse,
  StandardErrorResponse,
} from '@/addons/interfaces/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserResponse implements StandardResponse {
  @ApiProperty({
    type: String,
    example: 'User registered successfully. Please verify your email address.',
  })
  message: string;

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpvaG4ifQ.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpvaG4ifQ',
  })
  access_token?: string;
}

export class RegisterUserBadRequestResponse implements StandardErrorResponse {
  @ApiProperty({
    type: Number,
    example: 400,
  })
  status: number;
  @ApiProperty({
    type: String,
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    type: String,
    example: '/api/v1/auth/register',
  })
  path: string;

  @ApiProperty({
    type: String,
    example: '2024-12-27T22:07:37.368Z',
  })
  timestamp: string;
}
