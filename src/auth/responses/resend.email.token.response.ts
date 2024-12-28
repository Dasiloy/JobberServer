import {
  StandardResponse,
  StandardErrorResponse,
} from '@/addons/interfaces/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailTokenResponse implements StandardResponse {
  @ApiProperty({
    type: String,
    example: 'Email verification token resent successfully',
  })
  message: string;
}

export class ResendEmailTokenBadRequestResponse
  implements StandardErrorResponse
{
  @ApiProperty({
    type: Number,
    example: 400,
  })
  status: number;

  @ApiProperty({
    type: String,
    example: 'Email is already verified.',
  })
  message: string;

  @ApiProperty({
    type: String,
    example: '/api/v1/auth/resend-email-verification-token',
  })
  path: string;

  @ApiProperty({
    type: String,
    example: '2024-12-27T22:07:37.368Z',
  })
  timestamp: string;
}
