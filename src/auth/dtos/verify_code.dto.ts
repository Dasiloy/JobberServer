import { IsNumberString } from 'class-validator';

export class VerifyCodeDto {
  @IsNumberString()
  token: string;
}
