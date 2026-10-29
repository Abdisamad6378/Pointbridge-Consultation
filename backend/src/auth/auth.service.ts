import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { toPublicUser, type User } from '../users/user.entity.js';
import type { JwtPayload } from './jwt-auth.guard.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { name, email, password, organization } = dto;
    const user = await this.usersService.create({ name, email, password, organization, role: 'user' });
    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmailWithPassword(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueSession(user);
  }

  private async issueSession(user: User) {
    const payload: JwtPayload = { sub: user.id };
    return {
      ok: true as const,
      token: await this.jwtService.signAsync(payload),
      user: toPublicUser(user),
    };
  }
}
