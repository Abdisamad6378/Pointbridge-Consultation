import { Trim } from '../../common/trim.decorator.js';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { USER_ROLES, type UserRole } from '../user.entity.js';

export class UpdateUserDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(200)
  organization?: string;

  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;
}
