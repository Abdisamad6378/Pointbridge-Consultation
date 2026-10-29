import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AuthGuardsModule } from './auth-guards.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [UsersModule, AuthGuardsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
