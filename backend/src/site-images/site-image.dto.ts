import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../common/trim.decorator.js';

// Accepts absolute http(s) URLs and site-relative paths such as "/pointbridge-logo.png".
const IMAGE_URL = /^(https?:\/\/\S+|\/\S*)$/;

export class UpdateSiteImageDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  label?: string;

  @IsOptional()
  @Trim()
  @Matches(IMAGE_URL, { message: 'url must be an http(s) URL or a path starting with /' })
  @MaxLength(2000)
  url?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  category?: string;
}

export class CreateSiteImageDto {
  @Trim()
  @Matches(/^[a-z0-9][a-z0-9._-]*$/i, { message: 'key may only contain letters, numbers, ".", "_" and "-"' })
  @MaxLength(100)
  key: string;

  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  label: string;

  @Trim()
  @Matches(IMAGE_URL, { message: 'url must be an http(s) URL or a path starting with /' })
  @MaxLength(2000)
  url: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  category?: string;
}
