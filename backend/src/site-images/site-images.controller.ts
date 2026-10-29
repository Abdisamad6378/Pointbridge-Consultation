import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AdminOnly } from '../auth/admin-only.decorator.js';
import { SiteImagesService } from './site-images.service.js';
import { CreateSiteImageDto, UpdateSiteImageDto } from './site-image.dto.js';

@Controller('api/content/images')
export class PublicSiteImagesController {
  constructor(private readonly siteImagesService: SiteImagesService) {}

  @Get()
  findAll() {
    return this.siteImagesService.findAllWithMap();
  }
}

@Controller('api/admin/images')
@AdminOnly()
export class AdminSiteImagesController {
  constructor(private readonly siteImagesService: SiteImagesService) {}

  @Get()
  async findAll() {
    return { items: await this.siteImagesService.findAll() };
  }

  @Post()
  async create(@Body() dto: CreateSiteImageDto) {
    return { item: await this.siteImagesService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSiteImageDto) {
    return { item: await this.siteImagesService.update(id, dto) };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.siteImagesService.remove(id);
    return { ok: true };
  }
}
