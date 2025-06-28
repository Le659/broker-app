// api/src/properties/property.service.ts
import {
  Injectable,
  NotFoundException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './property.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private readonly repo: Repository<Property>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PropertyService.name);
  }

  async findAll(): Promise<Property[]> {
    this.logger.debug('Buscando todas as propriedades');
    const list = await this.repo.find();
    this.logger.info(`Encontradas ${list.length} propriedades`);
    return list;
  }

  async findOne(id: number): Promise<Property> {
    this.logger.debug({ id }, 'Buscando propriedade');
    const prop = await this.repo.findOneBy({ id });
    if (!prop) {
      this.logger.warn({ id }, 'Propriedade não encontrada');
      throw new NotFoundException(`Property ${id} not found`);
    }
    return prop;
  }

  async create(dto: CreatePropertyDto): Promise<Property> {
    this.logger.debug({ dto }, 'Criando propriedade');
    const prop = this.repo.create(dto);
    const saved = await this.repo.save(prop);
    await this.cache.del('GET-/properties');
    this.logger.info({ id: saved.id }, 'Propriedade criada');
    return saved;
  }

  async update(id: number, dto: UpdatePropertyDto): Promise<Property> {
    this.logger.debug({ id, dto }, 'Atualizando propriedade');
    await this.findOne(id);
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    await this.cache.del('GET-/properties');
    this.logger.info({ id }, 'Propriedade atualizada');
    return updated!;
  }

  async remove(id: number): Promise<void> {
    this.logger.debug({ id }, 'Removendo propriedade');
    const prop = await this.findOne(id);
    await this.repo.remove(prop);
    await this.cache.del('GET-/properties');
    this.logger.info({ id }, 'Propriedade removida');
  }
}
