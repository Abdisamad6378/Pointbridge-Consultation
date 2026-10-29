import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const BCRYPT_ROUNDS = 10;
const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User id ${id} not found`);
    return user;
  }

  findOneByEmail(email: string) {
    return this.repo.findOneBy({ email: email.trim().toLowerCase() });
  }

  findOneByEmailWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  async create(dto: CreateUserDto) {
    if (await this.repo.existsBy({ email: dto.email })) {
      throw new ConflictException('Email already exists');
    }
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
      organization: dto.organization ?? '',
      role: dto.role ?? 'user',
    });
    try {
      const saved = await this.repo.save(user);
      return this.findOne(saved.id);
    } catch (error) {
      // Covers the race where two sign-ups for the same email pass the check above.
      if (error instanceof QueryFailedError && (error.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.organization !== undefined) user.organization = dto.organization;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.password !== undefined) user.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    await this.repo.save(user);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User id ${id} not found`);
  }

  count() {
    return this.repo.count();
  }
}
