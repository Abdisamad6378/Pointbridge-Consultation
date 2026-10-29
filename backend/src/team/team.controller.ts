import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AdminOnly } from '../auth/admin-only.decorator.js';
import { TeamService } from './team.service.js';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './team-member.dto.js';

@Controller('api/content/team')
export class PublicTeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll() {
    return { items: await this.teamService.findAll() };
  }
}

@Controller('api/admin/team')
@AdminOnly()
export class AdminTeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll() {
    return { items: await this.teamService.findAll() };
  }

  @Post()
  async create(@Body() dto: CreateTeamMemberDto) {
    return { item: await this.teamService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTeamMemberDto) {
    return { item: await this.teamService.update(id, dto) };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.teamService.remove(id);
    return { ok: true };
  }
}
