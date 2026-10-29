import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module.js';
import { PasswordResetCode } from './password-reset-code.entity.js';
import { PasswordResetService } from './password-reset.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthGuardsModule } from './auth-guards.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [UsersModule, AuthGuardsModule, MailModule, TypeOrmModule.forFeature([PasswordResetCode])],
  controllers: [AuthController],
  providers: [AuthService, PasswordResetService],
})
export class AuthModule {}
