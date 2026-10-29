import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './testimonial.entity.js';
import { CreateTestimonialDto, FeedbackDto, UpdateTestimonialDto } from './testimonial.dto.js';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial) private readonly repo: Repository<Testimonial>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findApproved() {
    return this.repo.find({ where: { approved: true }, order: { createdAt: 'DESC' } });
  }

  create(dto: CreateTestimonialDto) {
    return this.repo.save(
      this.repo.create({
        name: dto.name,
        role: dto.role,
        quote: dto.quote,
        image: dto.image ?? null,
        approved: dto.approved ?? false,
      }),
    );
  }

  submitFeedback(dto: FeedbackDto) {
    return this.repo.save(this.repo.create({ name: dto.name, role: dto.role, quote: dto.quote, approved: false }));
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Testimonial ${id} not found`);
    Object.assign(item, Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)));
    return this.repo.save(item);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Testimonial ${id} not found`);
  }

  async counts() {
    const [total, pending] = await Promise.all([this.repo.count(), this.repo.countBy({ approved: false })]);
    return { total, pending };
  }
}
