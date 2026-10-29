import { IsIn, IsOptional } from 'class-validator';
import { SignupDto } from '../../auth/dto/signup.dto.js';
import { USER_ROLES, type UserRole } from '../user.entity.js';

export class CreateUserDto extends SignupDto {
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;
}
