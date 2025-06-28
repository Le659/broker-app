import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import request from 'supertest';

import { PropertyModule } from '../src/properties/property.module';
import { Property } from '../src/properties/property.entity';
import { Comparable } from '../src/properties/comparable.entity';

describe('Broker API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [
          CacheModule.register({ isGlobal: true }),
          LoggerModule.forRoot({ pinoHttp: { level: 'silent' } }),
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [Property, Comparable],
            synchronize: true,
            dropSchema: true,
          }),
          PropertyModule,
        ],
      }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/properties (GET) ➞ lista vazia', () =>
    request(app.getHttpServer())
      .get('/properties')
      .expect(200)
      .expect([]),
  );

  it('/properties (POST) ➞ cria id', () =>
    request(app.getHttpServer())
      .post('/properties')
      .send({
        address: 'X', value: 1, area: 1, bedrooms: 1,
        bathrooms: 1, parking: 0,
      })
      .expect(201)
      .then(res => expect(res.body).toHaveProperty('id')),
  );

  it('/properties/:id DELETE ➞ 204', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/properties')
      .send({
        address: 'Y', value: 2, area: 2, bedrooms: 2,
        bathrooms: 2, parking: 0,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/properties/${body.id}`)
      .expect(204);
  });
});
