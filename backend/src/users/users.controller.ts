import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { toPublicUser } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { AdminOnly } from '../auth/admin-only.decorator.js';

@Controller('api/admin/users')
@AdminOnly()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return { items: users.map(toPublicUser) };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { item: toPublicUser(await this.usersService.findOne(id)) };
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return { item: toPublicUser(await this.usersService.create(dto)) };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return { item: toPublicUser(await this.usersService.update(id, dto)) };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { ok: true };
  }
}
