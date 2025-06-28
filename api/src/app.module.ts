// broker-app/api/src/app.module.ts
import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import * as redisStoreModule from 'cache-manager-redis-store';
const redisStore = (redisStoreModule as any).default || (redisStoreModule as any);

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './properties/property.module';
import { RedisCacheInterceptor } from './cache.interceptor';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, levelFirst: true },
              }
            : undefined,
      },
    }),

    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.register({
      store: redisStore as any,
      socket: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!, 10),
      },
      ttl: parseInt(process.env.CACHE_TTL!, 10),
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres' as const,
        host: process.env.POSTGRES_HOST!,
        port: parseInt(process.env.POSTGRES_PORT!, 10),
        username: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    PropertyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: RedisCacheInterceptor },
  ],
})
export class AppModule {}
