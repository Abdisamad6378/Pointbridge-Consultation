import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { UsersModule } from '../users/users.module.js';
import { ContactsModule } from '../contacts/contacts.module.js';
import { TestimonialsModule } from '../testimonials/testimonials.module.js';
import { SiteImagesModule } from '../site-images/site-images.module.js';
import { TeamModule } from '../team/team.module.js';
import { ClientsModule } from '../clients/clients.module.js';
import { AdminStatsController } from './admin-stats.controller.js';

@Module({
  imports: [AuthGuardsModule, UsersModule, ContactsModule, TestimonialsModule, SiteImagesModule, TeamModule, ClientsModule],
  controllers: [AdminStatsController],
})
export class AdminModule {}
