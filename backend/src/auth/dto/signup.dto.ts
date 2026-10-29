import { Transform } from 'class-transformer';
import { Trim } from '../../common/trim.decorator.js';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// Public sign-up has no role field; new accounts are always 'user'.
export class SignupDto {
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email: string;

  // bcrypt only uses the first 72 bytes.
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(200)
  organization?: string;
}
