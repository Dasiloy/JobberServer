import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class FollowCompaniesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  company_ids: string[];
}
