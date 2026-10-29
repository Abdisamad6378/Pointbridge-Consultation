import { IsInt, IsOptional, Max, Min, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../common/trim.decorator.js';

export class UpdateTeamMemberDto {
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
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(2000)
  image?: string;

  @IsOptional()
  @IsInt()
  @Min(-1_000_000)
  @Max(1_000_000)
  sortOrder?: number;
}

export class CreateTeamMemberDto extends UpdateTeamMemberDto {
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  declare name: string;

  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  declare role: string;
}
