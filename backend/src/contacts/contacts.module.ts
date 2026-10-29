import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { ContactMessage } from './contact-message.entity.js';
import { ContactsService } from './contacts.service.js';
import { AdminContactsController, PublicContactController } from './contacts.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage]), AuthGuardsModule],
  controllers: [PublicContactController, AdminContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
