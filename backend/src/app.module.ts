import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { TestimonialsModule } from './testimonials/testimonials.module.js';
import { SiteImagesModule } from './site-images/site-images.module.js';
import { TeamModule } from './team/team.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { AdminModule } from './admin/admin.module.js';
import { buildDataSourceOptions } from './database/database.options.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Global default for every route; stricter limits via src/common/rate-limits.ts.
    // In-memory storage: per process, so use a shared store (e.g. Redis) if you run several instances.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: Number(config.get('THROTTLE_TTL_MS')) || 60_000,
          limit: Number(config.get('THROTTLE_LIMIT')) || 120,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        buildDataSourceOptions({
          DB_HOST: config.get('DB_HOST'),
          DB_PORT: config.get('DB_PORT'),
          DB_USERNAME: config.get('DB_USERNAME'),
          DB_PASSWORD: config.get('DB_PASSWORD'),
          DB_DATABASE: config.get('DB_DATABASE'),
        }),
    }),
    UsersModule,
    AuthModule,
    ContactsModule,
    TestimonialsModule,
    SiteImagesModule,
    TeamModule,
    ClientsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
