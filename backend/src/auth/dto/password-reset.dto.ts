import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

const normalizeEmail = Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value));

export class ForgotPasswordDto {
  @normalizeEmail
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @normalizeEmail
  @IsEmail()
  email: string;

  @Matches(/^\d{6}$/, { message: 'Enter the 6-digit code from the email' })
  code: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword: string;
}
