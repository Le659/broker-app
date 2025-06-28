// broker-app/api/test/api.e2e-spec.ts
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../src/app.controller';
import { PropertyModule } from '../src/properties/property.module';
import { Property } from '../src/properties/property.entity';
import { Comparable } from '../src/properties/comparable.entity';

describe('Broker API (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // montar conexão SQLite in-memory
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [Property, Comparable],
        }),
        // tudo que seu CRUD precisa
        PropertyModule,
      ],
      // registra a rota health
      controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  }, 20_000); // estende timeout caso demore um pouco

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) health', () => {
    return request(httpServer)
      .get('/')
      .expect(200)
      .expect('OK');
  });

  it('/properties (GET) ➞ []', () => {
    return request(httpServer)
      .get('/properties')
      .expect(200)
      .expect([]);
  });

  it('/properties (POST) ➞ cria e retorna id', () => {
    return request(httpServer)
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
    return request(httpServer)
      .get(`/properties/${createdId}`)
      .expect(200)
      .then(res => expect(res.body.id).toBe(createdId));
  });

  it('/properties/:id (PUT) ➞ atualiza e reflete mudança', () => {
    return request(httpServer)
      .put(`/properties/${createdId}`)
      .send({ bedrooms: 2 })
      .expect(200)
      .then(res => expect(res.body.bedrooms).toBe(2));
  });

  it('/properties/:id (DELETE) ➞ status 204', () => {
    return request(httpServer)
      .delete(`/properties/${createdId}`)
      .expect(204);
  });
});
