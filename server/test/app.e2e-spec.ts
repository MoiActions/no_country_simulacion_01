import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Module', () => {
    it('/auth/me (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('/auth/verify (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/auth/verify').expect(401);
    });
  });

  describe('Users Module', () => {
    it('/users/me (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('/users (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });
  });

  describe('Diagnosis Module', () => {
    it('/diagnosis/tests (GET) - should return available tests (public)', () => {
      return request(app.getHttpServer())
        .get('/diagnosis/tests')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/diagnosis/results (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/diagnosis/results').expect(401);
    });
  });

  describe('Learning Module', () => {
    it('/learning/paths (GET) - should return learning paths (public)', () => {
      return request(app.getHttpServer())
        .get('/learning/paths')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/learning/progress (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/learning/progress').expect(401);
    });

    it('/learning/skills/validated (GET) - should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/learning/skills/validated')
        .expect(401);
    });
  });

  describe('Professional Profile Module', () => {
    it('/professional-profile/full (GET) - should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/professional-profile/full')
        .expect(401);
    });
  });

  describe('Company Module', () => {
    it('/company/list (GET) - should return companies list', () => {
      return request(app.getHttpServer())
        .get('/company/list')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('Marketplace Module', () => {
    it('/marketplace/applications (GET) - should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/marketplace/applications')
        .expect(401);
    });

    it('/marketplace/talent/search (GET) - should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/marketplace/talent/search')
        .expect(401);
    });
  });

  describe('Notifications Module', () => {
    it('/notifications (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/notifications').expect(401);
    });

    it('/notifications/unread-count (GET) - should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/notifications/unread-count')
        .expect(401);
    });
  });
});
