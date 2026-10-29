import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AdminOnly } from '../auth/admin-only.decorator.js';
import { PublicFormRateLimit } from '../common/rate-limits.js';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto, UpdateContactStatusDto } from './contact.dto.js';

@Controller('api/contact')
export class PublicContactController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @PublicFormRateLimit()
  async create(@Body() dto: CreateContactDto) {
    await this.contactsService.create(dto);
    return { ok: true, message: "Thanks for reaching out — we'll get back to you shortly." };
  }
}

@Controller('api/admin/contacts')
@AdminOnly()
export class AdminContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll() {
    return { items: await this.contactsService.findAll() };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactStatusDto) {
    return { item: await this.contactsService.updateStatus(id, dto.status) };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.contactsService.remove(id);
    return { ok: true };
  }
}
