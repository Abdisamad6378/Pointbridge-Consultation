import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { SiteImage } from './site-image.entity.js';
import { SiteImagesService } from './site-images.service.js';
import { AdminSiteImagesController, PublicSiteImagesController } from './site-images.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([SiteImage]), AuthGuardsModule],
  controllers: [PublicSiteImagesController, AdminSiteImagesController],
  providers: [SiteImagesService],
  exports: [SiteImagesService],
})
export class SiteImagesModule {}
