import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

/** Tam DB e2e: `RUN_DB_E2E=1 npm run test:e2e` (Postgres ayakta olmalı) */
const runDbE2e = process.env.RUN_DB_E2E === '1';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    if (!runDbE2e) return;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  (runDbE2e ? it : it.skip)('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});
