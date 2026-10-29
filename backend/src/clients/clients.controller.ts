import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AdminOnly } from '../auth/admin-only.decorator.js';
import { ClientsService } from './clients.service.js';
import { CreateClientLogoDto, UpdateClientLogoDto } from './client-logo.dto.js';

@Controller('api/content/clients')
export class PublicClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll() {
    return { items: await this.clientsService.findAll() };
  }
}

@Controller('api/admin/clients')
@AdminOnly()
export class AdminClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll() {
    return { items: await this.clientsService.findAll() };
  }

  @Post()
  async create(@Body() dto: CreateClientLogoDto) {
    return { item: await this.clientsService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClientLogoDto) {
    return { item: await this.clientsService.update(id, dto) };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.clientsService.remove(id);
    return { ok: true };
  }
}
