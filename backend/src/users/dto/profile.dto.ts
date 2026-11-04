import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../common/trim.decorator.js';

export class UpdateProfileDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(200)
  organization?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(30)
  @Matches(/^[+\d\s().-]*$/, { message: 'Phone number may only contain digits, spaces, +, -, ( and )' })
  phone?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword: string;
}
