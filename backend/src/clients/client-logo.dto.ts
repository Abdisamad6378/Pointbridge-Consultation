import { IsInt, IsOptional, Max, Min, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim, TrimToNull } from '../common/trim.decorator.js';

export class UpdateClientLogoDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(2000)
  logo?: string | null;

  @IsOptional()
  @IsInt()
  @Min(-1_000_000)
  @Max(1_000_000)
  sortOrder?: number;
}

export class CreateClientLogoDto extends UpdateClientLogoDto {
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  declare name: string;
}
