import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

// Read-only checks against the configured database. If an entity gets ahead of the
// migrations, loading a user fails and these return 500 instead of the expected status.
describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/login rejects an unknown email with 401', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'nobody@example.invalid', password: 'not-a-real-password' })
      .expect(401)
      .expect((res) => expect(res.body.message).toBe('Invalid credentials'));
  });

  it('POST /api/auth/login rejects a malformed email with 400', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'not-a-real-password' })
      .expect(400);
  });

  it('GET /api/auth/me rejects a missing token with 401', () => {
    return request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });
});
