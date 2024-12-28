import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfilePortfolioItemDto {
  @IsOptional()
  @IsString({
    message: 'Title must be a string',
  })
  @MinLength(3, {
    message: 'Title must be at least 3 characters long',
  })
  @MaxLength(255, {
    message: 'Title must be less than or equal to 255 characters long',
  })
  title: string;

  @IsOptional()
  @IsString({
    message: 'Description must be a string',
  })
  @MinLength(3, {
    message: 'Description must be at least 3 characters long',
  })
  @MaxLength(255, {
    message: 'Description must be less than or equal to 500 characters long',
  })
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString({
    message: 'Portfolio item URL must be a string',
  })
  portfolio_item_url: string;
}
