import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AdminOnly } from '../auth/admin-only.decorator.js';
import { PublicFormRateLimit } from '../common/rate-limits.js';
import { TestimonialsService } from './testimonials.service.js';
import { CreateTestimonialDto, FeedbackDto, UpdateTestimonialDto } from './testimonial.dto.js';

@Controller('api/content')
export class PublicTestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get('testimonials')
  async findApproved() {
    return { items: await this.testimonialsService.findApproved() };
  }

  @Post('feedback')
  @PublicFormRateLimit()
  async submitFeedback(@Body() dto: FeedbackDto) {
    await this.testimonialsService.submitFeedback(dto);
    return { ok: true, message: 'Thank you! Your feedback will appear once it has been reviewed.' };
  }
}

@Controller('api/admin/testimonials')
@AdminOnly()
export class AdminTestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  async findAll() {
    return { items: await this.testimonialsService.findAll() };
  }

  @Post()
  async create(@Body() dto: CreateTestimonialDto) {
    return { item: await this.testimonialsService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTestimonialDto) {
    return { item: await this.testimonialsService.update(id, dto) };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.testimonialsService.remove(id);
    return { ok: true };
  }
}
