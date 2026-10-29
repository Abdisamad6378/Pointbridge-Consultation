import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { ClientLogo } from './client-logo.entity.js';
import { ClientsService } from './clients.service.js';
import { AdminClientsController, PublicClientsController } from './clients.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClientLogo]), AuthGuardsModule],
  controllers: [PublicClientsController, AdminClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
