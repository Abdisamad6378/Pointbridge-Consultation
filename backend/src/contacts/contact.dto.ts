import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim, TrimToNull } from '../common/trim.decorator.js';
import { CONTACT_STATUSES, type ContactStatus } from './contact-message.entity.js';

// Limits mirror the zod schema in frontend/src/routes/contact.tsx.
export class CreateContactDto {
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @TrimToNull()
  @IsString()
  @MaxLength(120)
  org?: string | null;

  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  subject: string;

  @Trim()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;
}

export class UpdateContactStatusDto {
  @IsIn(CONTACT_STATUSES)
  status: ContactStatus;
}
