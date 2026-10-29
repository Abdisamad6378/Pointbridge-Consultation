import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // Behind a reverse proxy (nginx, Vercel, etc.) set TRUST_PROXY=1 so rate limiting
  // keys on the real client IP from X-Forwarded-For instead of the proxy's address.
  const trustProxy = Number(config.get('TRUST_PROXY')) || 0;
  if (trustProxy) app.set('trust proxy', trustProxy);

  // JSON-only API: lock the CSP down completely and forbid embedding.
  app.use(
    helmet({
      contentSecurityPolicy: { useDefaults: false, directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      frameguard: { action: 'deny' },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.disable('x-powered-by');

  const allowedOrigins = config
    .get<string>('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  app.enableCors({
    // Exact-match allowlist; requests without an Origin (curl, server-to-server) are
    // unaffected by CORS and still go through normal auth.
    origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Retry-After'],
    // Auth uses a Bearer header, never cookies, so credentialed CORS stays off.
    credentials: false,
    maxAge: 600,
  });

  app.useBodyParser('json', { limit: '100kb' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(config.get<number>('PORT', 3000));
}
await bootstrap();
