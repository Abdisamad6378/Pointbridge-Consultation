import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { PasswordResetService, RESET_CODE_TTL_MINUTES } from './password-reset.service.js';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto.js';
import { JwtAuthGuard, type AuthenticatedRequest } from './jwt-auth.guard.js';
import { toPublicUser } from '../users/user.entity.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthRateLimit, PublicFormRateLimit, SignupRateLimit } from '../common/rate-limits.js';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Post('signup')
  @SignupRateLimit()
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @PublicFormRateLimit()
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.passwordResetService.requestCode(dto);
    return {
      ok: true,
      message: `If an account exists for that email, we've sent a 6-digit code. It expires in ${RESET_CODE_TTL_MINUTES} minutes.`,
    };
  }

  @Post('reset-password')
  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const user = await this.passwordResetService.resetPassword(dto);
    return this.authService.createSession(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return { user: toPublicUser(req.user) };
  }
}
