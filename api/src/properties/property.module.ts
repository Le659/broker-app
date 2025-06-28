import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

import { Property } from './property.entity';
import { Comparable } from './comparable.entity';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, Comparable]),
    CacheModule.register({
      ttl: 30, // tempo de vida padrão em segundos
      max: 100, // número máximo de itens em cache
    }),
    LoggerModule.forRoot({
      pinoHttp: { level: 'debug' },
    }),
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(PropertyModule.name);
  }
}
