// broker-app/api/test/api.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  CacheModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { PropertyModule } from '../src/properties/property.module';
import { Property } from '../src/properties/property.entity';

describe('PropertyController (e2e)', () => {
  let app: INestApplication;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // necessário para injetar CACHE_MANAGER
        CacheModule.register(),
        // configuração in-memory do TypeORM
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Property],
          synchronize: true,
        }),
        // módulo que contém o controller/service que você vai testar
        PropertyModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/properties (GET) ➞ []', () => {
    return request(app.getHttpServer())
      .get('/properties')
      .expect(200)
      .expect([]);
  });

  it('/properties (POST) ➞ cria e retorna id', () => {
    return request(app.getHttpServer())
      .post('/properties')
      .send({
        address: 'Rua Teste',
        area: 50,
        bedrooms: 1,
        bathrooms: 1,
        parking: 0,
        geom: null,
      })
      .expect(201)
      .then(res => {
        expect(res.body.id).toBeDefined();
        createdId = res.body.id;
      });
  });

  it('/properties/:id (GET) ➞ encontra criado', () => {
    return request(app.getHttpServer())
      .get(`/properties/${createdId}`)
      .expect(200)
      .then(res => expect(res.body.id).toBe(createdId));
  });

  it('/properties/:id (PUT) ➞ atualiza e reflete mudança', () => {
    return request(app.getHttpServer())
      .put(`/properties/${createdId}`)
      .send({ bedrooms: 2 })
      .expect(200)
      .then(res => expect(res.body.bedrooms).toBe(2));
  });

  it('/properties/:id (DELETE) ➞ status 204', () => {
    return request(app.getHttpServer())
      .delete(`/properties/${createdId}`)
      .expect(204);
  });
});
