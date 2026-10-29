import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity.js';
import { UserAvatar } from './user-avatar.entity.js';
import { UsersService } from './users.service.js';
import { ChangePasswordDto, UpdateProfileDto } from './dto/profile.dto.js';

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

// The subset of multer's in-memory upload that we rely on.
export type UploadedImage = { buffer: Buffer };

// Identify the format from the file's own bytes; the client-sent MIME type is not trusted.
function detectImageType(data: Buffer): string | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png';
  }
  if (data.length >= 12 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  return null;
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserAvatar) private readonly avatars: Repository<UserAvatar>,
  ) {}

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.usersService.update(userId, { name: dto.name, organization: dto.organization });
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    await this.usersService.update(userId, { password: dto.newPassword });
  }

  async setAvatar(userId: number, file: UploadedImage | undefined) {
    if (!file?.buffer?.length) throw new BadRequestException('Choose an image to upload');
    const mimeType = detectImageType(file.buffer);
    if (!mimeType) throw new BadRequestException('Profile photo must be a JPEG, PNG or WebP image');

    await this.dataSource.transaction(async (manager) => {
      await manager.upsert(UserAvatar, { userId, data: file.buffer, mimeType }, ['userId']);
      await manager.update(User, { id: userId }, { avatarUpdatedAt: new Date() });
    });
    return this.usersService.findOne(userId);
  }

  async removeAvatar(userId: number) {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(UserAvatar, { userId });
      await manager.update(User, { id: userId }, { avatarUpdatedAt: null });
    });
    return this.usersService.findOne(userId);
  }

  async getAvatar(userId: number) {
    const avatar = await this.avatars.findOneBy({ userId });
    if (!avatar) throw new NotFoundException('No profile photo');
    return avatar;
  }
}
