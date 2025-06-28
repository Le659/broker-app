// broker-app/api/src/cache.interceptor.ts
import {
  Injectable,
  CacheInterceptor as NestCacheInterceptor,
  ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class RedisCacheInterceptor extends NestCacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const req = context.switchToHttp().getRequest();
    // só cachear GET
    if (req.method !== 'GET') return undefined;
    // chave simples: METHOD-URL
    return `${req.method}-${req.originalUrl}`;
  }
}
