import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientLogo } from './client-logo.entity.js';
import { CreateClientLogoDto, UpdateClientLogoDto } from './client-logo.dto.js';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientLogo) private readonly repo: Repository<ClientLogo>,
  ) {}

  findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC', createdAt: 'ASC' } });
  }

  create(dto: CreateClientLogoDto) {
    return this.repo.save(
      this.repo.create({ name: dto.name, logo: dto.logo ?? null, sortOrder: dto.sortOrder ?? 0 }),
    );
  }

  async update(id: string, dto: UpdateClientLogoDto) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Client ${id} not found`);
    Object.assign(item, Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)));
    return this.repo.save(item);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Client ${id} not found`);
  }

  count() {
    return this.repo.count();
  }
}
