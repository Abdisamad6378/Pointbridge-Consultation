import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim, TrimToNull } from '../common/trim.decorator.js';

// Submitted by visitors; always stored unapproved.
export class FeedbackDto {
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  role: string;

  @Trim()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  quote: string;
}

export class CreateTestimonialDto extends FeedbackDto {
  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(2000)
  image?: string | null;
}

export class UpdateTestimonialDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  role?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  quote?: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(2000)
  image?: string | null;
}
