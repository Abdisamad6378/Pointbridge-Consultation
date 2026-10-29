import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { Testimonial } from './testimonial.entity.js';
import { TestimonialsService } from './testimonials.service.js';
import { AdminTestimonialsController, PublicTestimonialsController } from './testimonials.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial]), AuthGuardsModule],
  controllers: [PublicTestimonialsController, AdminTestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
