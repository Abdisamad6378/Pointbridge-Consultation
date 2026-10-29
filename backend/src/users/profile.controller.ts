import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { AuthRateLimit, ProfileWriteRateLimit } from '../common/rate-limits.js';
import { toPublicUser } from './user.entity.js';
import { AVATAR_MAX_BYTES, ProfileService, type UploadedImage } from './profile.service.js';
import { ChangePasswordDto, UpdateProfileDto } from './dto/profile.dto.js';

@Controller('api/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  @ProfileWriteRateLimit()
  async update(@Req() req: AuthenticatedRequest, @Body() dto: UpdateProfileDto) {
    return { user: toPublicUser(await this.profileService.updateProfile(req.user.id, dto)) };
  }

  @Post('password')
  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: AuthenticatedRequest, @Body() dto: ChangePasswordDto) {
    await this.profileService.changePassword(req.user.id, dto);
    return { ok: true };
  }

  @Put('avatar')
  @ProfileWriteRateLimit()
  @UseInterceptors(FileInterceptor('avatar', { limits: { fileSize: AVATAR_MAX_BYTES, files: 1 } }))
  async uploadAvatar(@Req() req: AuthenticatedRequest, @UploadedFile() file: UploadedImage | undefined) {
    return { user: toPublicUser(await this.profileService.setAvatar(req.user.id, file)) };
  }

  @Delete('avatar')
  @ProfileWriteRateLimit()
  async removeAvatar(@Req() req: AuthenticatedRequest) {
    return { user: toPublicUser(await this.profileService.removeAvatar(req.user.id)) };
  }
}

// Public so <img> tags can load it without an Authorization header.
// URLs carry ?v=<timestamp>, so a new upload changes the URL and long caching is safe.
@Controller('api/users')
export class AvatarController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id/avatar')
  async avatar(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) res: Response) {
    const avatar = await this.profileService.getAvatar(id);
    res.set({
      'Cache-Control': 'public, max-age=31536000, immutable',
      // The frontend may live on another origin in production.
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    return new StreamableFile(avatar.data, { type: avatar.mimeType, disposition: 'inline' });
  }
}
