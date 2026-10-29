import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage, type ContactStatus } from './contact-message.entity.js';
import { CreateContactDto } from './contact.dto.js';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactMessage) private readonly repo: Repository<ContactMessage>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateContactDto) {
    const { name, email, org, subject, message } = dto;
    return this.repo.save(this.repo.create({ name, email, org: org ?? null, subject, message }));
  }

  async updateStatus(id: string, status: ContactStatus) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Message ${id} not found`);
    item.status = status;
    return this.repo.save(item);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Message ${id} not found`);
  }

  async counts() {
    const [total, unread] = await Promise.all([this.repo.count(), this.repo.countBy({ status: 'new' })]);
    return { total, new: unread };
  }
}
