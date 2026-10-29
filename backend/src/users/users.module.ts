import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { UserAvatar } from './user-avatar.entity.js';
import { ProfileService } from './profile.service.js';
import { AvatarController, ProfileController } from './profile.controller.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAvatar]), AuthGuardsModule],
  controllers: [UsersController, ProfileController, AvatarController],
  providers: [UsersService, ProfileService],
  exports: [UsersService],
})
export class UsersModule {}
