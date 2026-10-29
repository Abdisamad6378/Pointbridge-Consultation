import { Controller, Get } from '@nestjs/common';
import { AdminOnly } from '../auth/admin-only.decorator.js';
import { UsersService } from '../users/users.service.js';
import { ContactsService } from '../contacts/contacts.service.js';
import { TestimonialsService } from '../testimonials/testimonials.service.js';
import { SiteImagesService } from '../site-images/site-images.service.js';
import { TeamService } from '../team/team.service.js';
import { ClientsService } from '../clients/clients.service.js';

@Controller('api/admin/stats')
@AdminOnly()
export class AdminStatsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly contactsService: ContactsService,
    private readonly testimonialsService: TestimonialsService,
    private readonly siteImagesService: SiteImagesService,
    private readonly teamService: TeamService,
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  async stats() {
    const [contacts, testimonials, images, users, team, clients] = await Promise.all([
      this.contactsService.counts(),
      this.testimonialsService.counts(),
      this.siteImagesService.count(),
      this.usersService.count(),
      this.teamService.count(),
      this.clientsService.count(),
    ]);
    return {
      contacts,
      testimonials,
      images: { total: images },
      users: { total: users },
      team: { total: team },
      clients: { total: clients },
    };
  }
}
