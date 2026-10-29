import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteImage } from './site-image.entity.js';
import { CreateSiteImageDto, UpdateSiteImageDto } from './site-image.dto.js';

@Injectable()
export class SiteImagesService {
  constructor(
    @InjectRepository(SiteImage) private readonly repo: Repository<SiteImage>,
  ) {}

  findAll() {
    return this.repo.find({ order: { category: 'ASC', key: 'ASC' } });
  }

  async findAllWithMap() {
    const items = await this.findAll();
    return { items, map: Object.fromEntries(items.map((image) => [image.key, image.url])) };
  }

  async create(dto: CreateSiteImageDto) {
    if (await this.repo.existsBy({ key: dto.key })) {
      throw new ConflictException(`An image with key "${dto.key}" already exists`);
    }
    const { key, label, url, category } = dto;
    return this.repo.save(this.repo.create({ key, label, url, category: category ?? 'other' }));
  }

  async update(id: string, dto: UpdateSiteImageDto) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Image ${id} not found`);
    Object.assign(item, Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)));
    return this.repo.save(item);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Image ${id} not found`);
  }

  count() {
    return this.repo.count();
  }
}
