import type { DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity.js';
import { UserAvatar } from '../users/user-avatar.entity.js';
import { ContactMessage } from '../contacts/contact-message.entity.js';
import { Testimonial } from '../testimonials/testimonial.entity.js';
import { SiteImage } from '../site-images/site-image.entity.js';
import { TeamMember } from '../team/team-member.entity.js';
import { ClientLogo } from '../clients/client-logo.entity.js';

type DbEnv = {
  DB_HOST?: string;
  DB_PORT?: string | number;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_DATABASE?: string;
};

// Shared by the Nest app (via ConfigService) and the TypeORM CLI data source,
// so both always point at the same schema and migrations.
export function buildDataSourceOptions(env: DbEnv): DataSourceOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST ?? '127.0.0.1',
    port: Number(env.DB_PORT) || 5432,
    username: env.DB_USERNAME ?? 'postgres',
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE ?? 'pointbridge',
    entities: [User, UserAvatar, ContactMessage, Testimonial, SiteImage, TeamMember, ClientLogo],
    migrations: [new URL('../migrations/*.js', import.meta.url).pathname],
    synchronize: false,
  };
}
