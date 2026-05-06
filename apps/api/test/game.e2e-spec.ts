import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { execSync } from 'child_process';
import { join } from 'path';
import { AppModule } from '../src/app.module';

const runDbE2e = process.env.RUN_DB_E2E === '1';
const apiRoot = join(__dirname, '..');

describe('Game flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(() => {
    if (!runDbE2e) return;
    execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env, cwd: apiRoot });
    try {
      execSync('npx prisma db seed', { stdio: 'inherit', env: process.env, cwd: apiRoot });
    } catch {
      /* seed may skip */
    }
  });

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

  (runDbE2e ? it : it.skip)('full room: profile then game then results', async () => {
    const cats = await request(app.getHttpServer()).get('/public/categories').expect(200);
    const sevgili = cats.body.find((c: { slug: string }) => c.slug === 'sevgili');
    expect(sevgili).toBeTruthy();

    const profileQs = await request(app.getHttpServer())
      .get('/public/categories/sevgili/questions')
      .query({ phase: 'profile' })
      .expect(200);
    const gameQs = await request(app.getHttpServer())
      .get('/public/categories/sevgili/questions')
      .query({ phase: 'game' })
      .expect(200);
    expect(profileQs.body.length).toBeGreaterThan(0);
    expect(gameQs.body.length).toBeGreaterThan(0);

    const create = await request(app.getHttpServer())
      .post('/rooms')
      .send({ categoryId: sevgili.id, hostDisplayName: 'Host' })
      .expect(201);
    const { secretId, shortCode, hostPlayerToken } = create.body;

    const join = await request(app.getHttpServer())
      .post('/rooms/join')
      .send({ shortCode, guestDisplayName: 'Guest' })
      .expect(201);
    const { guestPlayerToken } = join.body;

    const hostAnswers = profileQs.body.map((q: { id: string }) => ({
      questionId: q.id,
      value: `host-${q.id}`,
    }));
    const guestAnswers = profileQs.body.map((q: { id: string }) => ({
      questionId: q.id,
      value: `guest-${q.id}`,
    }));

    await request(app.getHttpServer())
      .post(`/rooms/${secretId}/profile-answers`)
      .set('Authorization', `Bearer ${hostPlayerToken}`)
      .send({ answers: hostAnswers })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/rooms/${secretId}/profile-answers`)
      .set('Authorization', `Bearer ${guestPlayerToken}`)
      .send({ answers: guestAnswers })
      .expect(201);

    const byGameId = new Map<string, { mapsToQuestionId?: string | null }>(
      gameQs.body.map((q: { id: string; mapsToQuestionId?: string | null }) => [q.id, q]),
    );

    for (let i = 0; i < gameQs.body.length; i++) {
      const state = await request(app.getHttpServer())
        .get(`/rooms/${secretId}/state`)
        .set('Authorization', `Bearer ${hostPlayerToken}`)
        .expect(200);
      expect(state.body.status).toBe('playing');
      const qid = state.body.currentQuestionId as string;
      expect(qid).toBeTruthy();

      const mapsTo = byGameId.get(qid)?.mapsToQuestionId;
      expect(mapsTo).toBeTruthy();
      const hostGuess = guestAnswers.find((a: { questionId: string }) => a.questionId === mapsTo)?.value;
      const guestGuess = hostAnswers.find((a: { questionId: string }) => a.questionId === mapsTo)?.value;

      await request(app.getHttpServer())
        .post(`/rooms/${secretId}/game-answers`)
        .set('Authorization', `Bearer ${hostPlayerToken}`)
        .send({ questionId: qid, value: hostGuess })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/rooms/${secretId}/game-answers`)
        .set('Authorization', `Bearer ${guestPlayerToken}`)
        .send({ questionId: qid, value: guestGuess })
        .expect(201);
    }

    const finalState = await request(app.getHttpServer())
      .get(`/rooms/${secretId}/state`)
      .set('Authorization', `Bearer ${hostPlayerToken}`)
      .expect(200);
    expect(finalState.body.status).toBe('finished');

    const results = await request(app.getHttpServer())
      .get(`/rooms/${secretId}/results`)
      .set('Authorization', `Bearer ${hostPlayerToken}`)
      .expect(200);
    expect(results.body.perPlayer).toHaveLength(2);
    expect(results.body.perPlayer[0].score + results.body.perPlayer[1].score).toBeGreaterThan(0);
  });
});
